import { describe, it, expect } from "@jest/globals";
import { request, app, sqlite } from "./setup.js";

describe("GET /api/ads", () => {
  it("retorna os anúncios do banco", async () => {
    sqlite.exec(
      `INSERT INTO ads (title, status) VALUES ('Anúncio Teste', 'active')`,
    );

    const res = await request(app).get("/api/ads");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Anúncio Teste");
  });
});
