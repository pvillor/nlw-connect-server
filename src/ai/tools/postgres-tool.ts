import { tool } from 'ai'
import z from 'zod'
import { pg } from '../../drizzle/client'

export const postgresTool = tool({
  description: `
    Realiza uma query no Postgres para buscar infromações sobre as tableas do banco de dados.

    Só pode realizar operações de busca (SELECT), não é permitida a geração de qualquer operação de escrita.

    Tables:
    """
    CREATE TABLE subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      created_at timestamp NOT NULL DEFAULT now()
    );

    Todas as operações devem retornar o máximo de 50 itens.
    """
  `.trim(),
  parameters: z.object({
    query: z.string().describe('A query do PostgreSQL para ser executada.'),
    params: z
      .array(z.string())
      .describe('Parâmetros da query a ser executada.'),
  }),
  execute: async ({ query, params }) => {
    const result = await pg.unsafe(query, params)

    return JSON.stringify(result)
  },
})
