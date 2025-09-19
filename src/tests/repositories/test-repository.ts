import { testService } from "../application/application-test";

export const testRepository = {
  clearAll: async () => {
    return await testService.clearAll();
  },
};
