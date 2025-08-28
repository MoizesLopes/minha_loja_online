# Webstore Prototype (Vite + React)

Protótipo simples de loja web com:
- Lista de produtos (imagem, descrição, preço)
- Busca e filtro por categoria
- Carrinho salvo no localStorage
- Checkout básico (formulário)
- Login simples para teste (localStorage)

## Credenciais de teste
- **Email:** admin@example.com
- **Senha:** 123456

## Rodando localmente
1. Instale dependências:
```bash
npm install
```
2. Inicie em modo dev:
```bash
npm run dev
```
3. Abra `http://localhost:5173` (Vite mostra o endereço no terminal).

## Deploy no Vercel (passo rápido)
1. Faça login em https://vercel.com (pode usar GitHub).
2. Crie um repositório no GitHub e faça commit/push deste projeto, ou faça upload do zip diretamente.
3. No Vercel, clique em "New Project" → Import Project → escolha o repositório (ou faça upload do zip).
4. O Vercel detecta Vite automaticamente. Clique em Deploy.
5. Em alguns segundos você terá um link `https://{seu-projeto}.vercel.app`.

## Observações
- Este protótipo **não** envia pedidos para backend. Para produção, crie uma API para salvar pedidos, autenticar usuários e processar pagamentos (PIX ou cartão).
- Arquivos e imagens usam placeholders públicos.
