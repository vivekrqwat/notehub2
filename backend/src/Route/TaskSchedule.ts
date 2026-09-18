import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import {
  createSchedule,
  DeleteTask,
  EditSchedule,
  GetSchedule,
} from "../Controller/TaskSchedulerController";
const TaskScheduleRouter = express.Router();

TaskScheduleRouter.post("/", AsyncHandler(createSchedule));
TaskScheduleRouter.get("/:id", AsyncHandler(GetSchedule));
TaskScheduleRouter.delete("/:id", AsyncHandler(DeleteTask));
TaskScheduleRouter.put("/:id", AsyncHandler(EditSchedule));

export default TaskScheduleRouter;
