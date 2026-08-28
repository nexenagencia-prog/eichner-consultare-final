# Eichner Consultare

Versão aprovada do site Eichner com CMS desacoplado do layout.

## Estrutura
- `index.html` + `style.css`: visual aprovado; não redesenhar.
- `js/site.js`: aplica o conteúdo do Supabase no DOM existente.
- `admin/`: CMS para textos, botões, links, listas e imagens.
- `supabase/migrations/`: segurança do CMS por chave hash + RLS.
- `tests/`: contratos que protegem a estrutura visual e o CMS.

## Fluxo de versões
- `main`: baseline visual aprovado.
- `cms-v1`: integração do CMS.
- Novas melhorias devem nascer de uma branch própria e passar por preview da Vercel antes de merge em `main`.

## CMS
A senha não fica no código. O navegador envia a chave somente no header `x-cms-key` e a guarda em `sessionStorage` durante a sessão. O banco armazena apenas o hash SHA-256.

## Testes
```bash
python3 -m pytest -q tests
```
