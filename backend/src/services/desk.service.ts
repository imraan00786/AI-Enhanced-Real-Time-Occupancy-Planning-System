import Desk from '../models/Desk.model';

export const getAllDesks = () => Desk.find();
export const getDeskById = (id: string) => Desk.findById(id);
export const createDesk = (data: any) => Desk.create(data);
export const updateDesk = (id: string, data: any) => Desk.findByIdAndUpdate(id, data, { new: true });
export const deleteDesk = (id: string) => Desk.findByIdAndDelete(id);
