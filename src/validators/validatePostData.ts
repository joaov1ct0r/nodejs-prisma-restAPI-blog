import Joi from "@hapi/joi";

const validateHandleNewPost = (data: Object): Joi.ValidationResult => {
  const schema: Joi.ObjectSchema<Object> = Joi.object({
    author: Joi.string().required().min(10).max(100),
    content: Joi.string().required().min(1).max(250),
  });

  return schema.validate(data);
};

const validateHandleEditPost = (data: Object): Joi.ValidationResult => {
  const schema: Joi.ObjectSchema<Object> = Joi.object({
    content: Joi.string().required().min(1).max(250),
  });

  return schema.validate(data);
};

const validateHandleDeletePost = (data: Object): Joi.ValidationResult => {
  const schema: Joi.ObjectSchema<Object> = Joi.object({
    postId: Joi.string().required().min(1),
  });

  return schema.validate(data);
};

const validateHandleOnePost = (data: Object): Joi.ValidationResult => {
  const schema: Joi.ObjectSchema<Object> = Joi.object({
    postId: Joi.string().required().min(1),
  });

  return schema.validate(data);
};

export {
  validateHandleNewPost,
  validateHandleEditPost,
  validateHandleDeletePost,
  validateHandleOnePost,
};