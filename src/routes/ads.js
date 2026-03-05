import { Router } from 'express';
import { db } from '../db/index.js';
import { ads } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

function sanitize(body) {
  return {
    title: body.title || null,
    description: body.description || null,
    price: body.price ? String(body.price) : null,
    imageUrl: body.imageUrl || null,
    category: body.category || null,
    status: body.status || 'active',
  };
}

router.get('/', async (req, res, next) => {
  try {
    const allAds = await db.select().from(ads).orderBy(ads.createdAt);
    res.json(allAds);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [ad] = await db.select().from(ads).where(eq(ads.id, Number(req.params.id)));
    if (!ad) return res.status(404).json({ error: 'Anúncio não encontrado' });
    res.json(ad);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = sanitize(req.body);
    if (!data.title) return res.status(400).json({ error: 'Título é obrigatório' });

    const [result] = await db.insert(ads).values(data);
    const [created] = await db.select().from(ads).where(eq(ads.id, result.insertId));
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = sanitize(req.body);
    if (!data.title) return res.status(400).json({ error: 'Título é obrigatório' });

    await db.update(ads).set(data).where(eq(ads.id, Number(req.params.id)));
    const [updated] = await db.select().from(ads).where(eq(ads.id, Number(req.params.id)));
    if (!updated) return res.status(404).json({ error: 'Anúncio não encontrado' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [ad] = await db.select().from(ads).where(eq(ads.id, Number(req.params.id)));
    if (!ad) return res.status(404).json({ error: 'Anúncio não encontrado' });
    await db.delete(ads).where(eq(ads.id, Number(req.params.id)));
    res.json({ message: 'Anúncio removido com sucesso' });
  } catch (error) {
    next(error);
  }
});

export default router;
