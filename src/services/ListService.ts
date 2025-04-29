class ListService {
  private endpoint =
    "https://geosapiens-react.free.beeceptor.com/v1/pesca/list";

  async getList() {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) throw new Error("Erro ao buscar listagem");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("ListService.getList ->", error);
      throw error;
    }
  }
}

export const listService = new ListService();
