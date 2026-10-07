# BoraAÍ V1.2

Guia local PWA de Boracéia, com catálogo de empresas, páginas individuais, busca, telefones úteis e painel administrativo.

## Novidades da V1.2
- Catálogo de comércios servido por API.
- Persistência com **Netlify Blobs**, para os cadastros sobreviverem a novos deploys.
- Busca e filtros por categoria.
- Página individual de cada comércio.
- Telefones úteis em página própria.
- Painel `/admin.html` para cadastrar, editar, destacar, ocultar e excluir empresas.
- Autenticação por senha com cookie HttpOnly e sessão assinada.
- PWA e identidade BoraAÍ mantidos.
- Estrutura preparada para monetização futura.

## Configuração obrigatória no Netlify
Crie estas variáveis de ambiente em **Project configuration → Environment variables**:

- `ADMIN_PASSWORD` — senha do painel.
- `ADMIN_SESSION_SECRET` — segredo longo e aleatório para assinar as sessões. Ex.: uma sequência aleatória com pelo menos 32 caracteres.

Não coloque esses valores no código ou no Git.

## Deploy
A V1.2 contém **Netlify Functions + Netlify Blobs**, portanto é recomendável publicar pelo Git conectado ao Netlify ou pela Netlify CLI. Um upload simples de arquivos estáticos não é suficiente para ativar as funções.

A pasta pública do site é `public/` e as funções ficam em `netlify/functions/`.

Depois do deploy:

1. Abra o site normalmente.
2. Teste `https://SEU-DOMINIO/api/negocios`.
3. Acesse `https://SEU-DOMINIO/admin.html`.
4. Entre com `ADMIN_PASSWORD`.
5. Cadastre os primeiros estabelecimentos reais.

Os dados de exemplo presentes na primeira execução são apenas para teste e devem ser substituídos pelos dados reais de Boracéia.
