import { query } from "express-validator";

// Дефолтные значения
import { SortDirectionTypes } from "../types/sort-types";
import { PaginationAndSorting } from "../types/pagintaion-types";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirectionTypes.Desc;
const DEFAULT_SORT_BY = "createdAt";

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>,
) {
  const allowedSortFields = Object.values(sortFieldsEnum);

  //   query('pageNumber') - указывает, что мы валидируем query-параметр с именем "pageNumber" из URL (например: /blogs?pageNumber=2)
  //     .optional() - делает параметр необязательным. Если параметр отсутствует в запросе, валидация не завершится ошибкой
  //     .default(DEFAULT_PAGE_NUMBER) - если параметр отсутствует, устанавливает значение по умолчанию (вероятно, это константа типа 1 или 0)
  // .isInt({ min: 1 }) - проверяет, что значение является целым числом и больше или равно 1. Это означает, что отрицательные числа и 0 не допускаются
  //     .withMessage('Page number must be a positive integer') - устанавливает кастомное сообщение об ошибке, которое будет показано, если валидация не пройдет
  //     .toInt() - преобразует строковое значение из query-параметра в целое число. Это важно, потому что все query-параметры приходят как строки

  return [
    query("pageNumber")
      .optional()
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage("Page number must be a positive integer")
      .toInt(),

    query("pageSize")
      .optional()
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage("Page size must be between 1 and 100")
      .toInt(),

    query("sortBy")
      .optional()
      .default("createdAt")
      .isIn(allowedSortFields)
      .withMessage(
        `Invalid sort field. Allowed values: ${allowedSortFields.join(", ")}`,
      ),

    query("sortDirection")
      .optional()
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirectionTypes))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirectionTypes).join(", ")}`,
      ),
  ];
}
