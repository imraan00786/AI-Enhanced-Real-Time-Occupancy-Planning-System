import { Request, Response } from 'express';
import Desk from '../models/Desk.model';

export class DeskController {
  async getAllDesks(req: Request, res: Response) {
    try {
      const desks = await Desk.find();
      res.json(desks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching desks', error });
    }
  }

  async getDeskById(req: Request, res: Response) {
    try {
      const desk = await Desk.findById(req.params.id);
      if (!desk) {
        return res.status(404).json({ message: 'Desk not found' });
      }
      res.json(desk);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching desk', error });
    }
  }

  async getDesksByFloor(req: Request, res: Response) {
    try {
      const { floor } = req.params;
      const desks = await Desk.find({ floor });
      res.json(desks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching desks by floor', error });
    }
  }

  async getAvailableDesks(req: Request, res: Response) {
    try {
      const desks = await Desk.find({ status: 'available' });
      res.json(desks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching available desks', error });
    }
  }

  async createDesk(req: Request, res: Response) {
    try {
      const desk = new Desk(req.body);
      await desk.save();
      res.status(201).json(desk);
    } catch (error) {
      res.status(400).json({ message: 'Error creating desk', error });
    }
  }

  async updateDesk(req: Request, res: Response) {
    try {
      const desk = await Desk.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!desk) {
        return res.status(404).json({ message: 'Desk not found' });
      }
      res.json(desk);
    } catch (error) {
      res.status(400).json({ message: 'Error updating desk', error });
    }
  }

  async deleteDesk(req: Request, res: Response) {
    try {
      const desk = await Desk.findByIdAndDelete(req.params.id);
      if (!desk) {
        return res.status(404).json({ message: 'Desk not found' });
      }
      res.json({ message: 'Desk deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting desk', error });
    }
  }

  async getDesksByFeatures(req: Request, res: Response) {
    try {
      const { features } = req.query;
      const query = { 'features': { $all: Object.entries(features as object) } };
      const desks = await Desk.find(query);
      res.json(desks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching desks by features', error });
    }
  }
} 