
export const ERRORS_MESSAGES = {
  createdBlogErrorFormMongo: 'Произошла ошибка при создании блога',
  createdPostErrorFormMongo: 'Произошла ошибка при создании поста для блога',
  createdUserErrorFormMongo: 'Произошла ошибка при создании пользователя',
  notFoundCurrentBlogById: 'Не удалось найти нужный блог',
  notFoundCurrentPostById: 'Не удалось найти нужный пост',
  notFoundCurrentUserById: 'Не удалось найти данного пользователя',
  notFoundCurrentCommentById: 'Не удалось найти нужный комментарий',
}

export enum STATUSES_CODE {
  // Success responses
  Success = 200,           // OK - успешный GET запрос
  Created = 201,           // Created - успешное создание ресурса
  NoContent = 204,         // No Content - успешное удаление или обновление без возврата данных

  // Client errors
  BadRequest = 400,        // Bad Request - ошибки валидации
  Unauthorized = 401,      // Unauthorized - не авторизован
  Forbidden = 403,         // Forbidden - нет прав доступа (если понадобится)
  NotFound = 404,          // Not Found - ресурс не найден

  // Server errors
  InternalServerError = 500, // Internal Server Error (на будущее)
}