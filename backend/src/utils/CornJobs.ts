import { Request, Response } from "express";
import cron from "node-cron";
import { TaskModel } from "../Model/TaskScheduler";
import { DeleteTask } from "../Controller/TaskSchedulerController";
import { Mongoose } from "mongoose";
import CheckEmail from "../Controller/EmailAuth";
export const CheckandSendTask = () => {
  cron.schedule(" 0 1 * * * ", SetTask);
};

const SetTask = async () => {
  console.log(" task is running");
  try {
    const date = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "2-digit",
      year: "2-digit",
    }).format(Date.now());
    console.log(date);
    const task = await TaskModel.find({ Date: date }).lean();

    // if(task.length>0){
    //         const now=new Date();
    //         const hours=now.getHours()
    //         const min=now.getMinutes();

    //     task.map((i)=>{

    //         const[uhours,umin,usec]=i.time.split(":")
    //         const u1hours=Number(uhours)
    //         const u1min=Number(umin)

    //         console.log(i._id.toString())
    //         const id=i._id.toString()
    //         console.log(u1hours,hours,min,u1min)
    //         if(hours>u1hours||(hours==u1hours&&min>=u1min)){
    //             console.log("functionality")
    //             DelTask(id)

    //         }
    //     })

    // }
    const newdate = new Date();
    const chours = newdate.getHours();
    const cmin = newdate.getMinutes();
    console.log(task);
    if (task.length == 0) return;

    const AllTaskIdToBeNeeded = await task.filter((i) => {
      const [uhours, umin] = i.time.split(":").map(Number);
      console.log(uhours);
      return chours > uhours || (chours == uhours && cmin >= umin);
    });

    const allPromise = AllTaskIdToBeNeeded.map((task) => {
      SendData(task.title, task.desc, task.email);
    });
    console.log(`Sending ${allPromise.length} email(s)...`);
    await Promise.all(allPromise);

    const getAllId = AllTaskIdToBeNeeded.map((i) => i._id);
    await TaskModel.deleteMany({ _id: { $in: getAllId } });
    console.log("deleted");
  } catch (er) {
    console.log(er);
  }
};

const SendData = async (title: string, desc: string, email: string) => {
  try {
    const message: string = `title:${title}\n
    ${desc}
    `;
    await CheckEmail(email, message);
    console.log("send email");
  } catch (e) {
    console.log(e);
  }
};
