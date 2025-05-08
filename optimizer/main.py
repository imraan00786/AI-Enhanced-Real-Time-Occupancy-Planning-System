from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import pulp
import numpy as np
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Workspace Optimizer Service")

class DeskPreference(BaseModel):
    employee_id: str
    preferred_location: Optional[str] = None
    desk_type: Optional[str] = None
    accessibility_required: bool = False
    preferred_days: List[str] = []
    privacy_preference: Optional[str] = None
    team_adjacency: List[str] = []
    special_needs: List[str] = []

class OptimizationRequest(BaseModel):
    desks: List[Dict]
    employees: List[DeskPreference]
    current_occupancy: Dict[str, bool]
    date: datetime

class OptimizationResponse(BaseModel):
    assignments: Dict[str, str]  # employee_id -> desk_id
    score: float
    constraints_satisfied: bool

def create_optimization_model(desks, employees, current_occupancy):
    """Create and solve the optimization model using PuLP."""
    # Create the optimization problem
    prob = pulp.LpProblem("Desk_Assignment", pulp.LpMaximize)
    
    # Decision variables: x[i,j] = 1 if employee i is assigned to desk j
    x = pulp.LpVariable.dicts("assignment",
                             ((i, j) for i in range(len(employees)) for j in range(len(desks))),
                             cat='Binary')
    
    # Objective function: Maximize preference satisfaction
    prob += pulp.lpSum([x[i,j] * calculate_preference_score(employees[i], desks[j]) 
                       for i in range(len(employees)) 
                       for j in range(len(desks))])
    
    # Constraints
    # Each employee gets exactly one desk
    for i in range(len(employees)):
        prob += pulp.lpSum([x[i,j] for j in range(len(desks))]) == 1
    
    # Each desk can only be assigned to one employee
    for j in range(len(desks)):
        prob += pulp.lpSum([x[i,j] for i in range(len(employees))]) <= 1
    
    # Cannot assign to occupied desks
    for j, desk in enumerate(desks):
        if current_occupancy.get(desk['id'], False):
            for i in range(len(employees)):
                prob += x[i,j] == 0
    
    return prob, x

def calculate_preference_score(employee: DeskPreference, desk: Dict) -> float:
    """Calculate how well a desk matches an employee's preferences."""
    score = 0.0
    
    # Location preference
    if employee.preferred_location and desk.get('location') == employee.preferred_location:
        score += 1.0
    
    # Desk type preference
    if employee.desk_type and desk.get('type') == employee.desk_type:
        score += 1.0
    
    # Accessibility
    if employee.accessibility_required and desk.get('is_accessible'):
        score += 2.0
    
    # Privacy preference
    if employee.privacy_preference and desk.get('privacy_level') == employee.privacy_preference:
        score += 1.0
    
    return score

@app.post("/optimize", response_model=OptimizationResponse)
async def optimize_assignments(request: OptimizationRequest):
    try:
        # Create and solve the optimization model
        prob, x = create_optimization_model(
            request.desks,
            request.employees,
            request.current_occupancy
        )
        
        # Solve the problem
        prob.solve(pulp.PULP_CBC_CMD(msg=False))
        
        if pulp.LpStatus[prob.status] != 'Optimal':
            raise HTTPException(status_code=400, detail="No optimal solution found")
        
        # Extract assignments
        assignments = {}
        for i, employee in enumerate(request.employees):
            for j, desk in enumerate(request.desks):
                if x[i,j].value() == 1:
                    assignments[employee.employee_id] = desk['id']
        
        # Calculate overall satisfaction score
        total_score = pulp.value(prob.objective)
        
        return OptimizationResponse(
            assignments=assignments,
            score=float(total_score),
            constraints_satisfied=True
        )
        
    except Exception as e:
        logger.error(f"Optimization error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 