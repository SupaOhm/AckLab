export interface DatabaseService {
  health(): Promise<"ok" | "unavailable">;
}

// TODO(database): Add ORM/client adapter when persistence is introduced.
export const databaseServicePlaceholder: DatabaseService = {
  async health() {
    return "unavailable";
  }
};
