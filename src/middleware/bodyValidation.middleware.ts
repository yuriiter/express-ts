import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

const validation = async <T extends ClassConstructor<any>>(
  dto: T,
  obj: Object | null,
) => {
  if (!obj) {
    return false;
  }
  const objInstance = plainToClass(dto, obj);
  const errors = await validate(objInstance);
  if (errors.length > 0) {
    return false;
  }
  return true;
};

const bodyValidation = <T extends ClassConstructor<any>>(dto: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isValid = await validation(dto, req.body);
    if (isValid) {
      next();
    } else {
      res.status(400).json({ message: "Bad parameters" });
    }
  };
};

export default bodyValidation;
