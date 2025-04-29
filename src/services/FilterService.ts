class FilterService {
  private endpoint =
    "https://geosapiens-react.free.beeceptor.com/v1/pesca/filtros";

  async getFilters() {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) throw new Error("Erro ao buscar filtros");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("FilterService.getFilters ->", error);
      throw error;
    }
  }
}

export const filterService = new FilterService();
