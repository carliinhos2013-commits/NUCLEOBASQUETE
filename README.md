# Núcleo Basquete App 🏀

> "A evolução não para."

O **Núcleo Basquete** é uma plataforma de alta performance para gestão de atletas, treinos e gamificação esportiva. Este sistema integra inteligência artificial, análise de dados e comunidade para transformar a jornada do jogador de basquete.

## 🔗 Repositório Oficial

Este projeto deve ser enviado para:
**https://github.com/lucrativod-dot/Nucleobasquete.git**

⚠️ **Correção de Deploy:**
Se o seu terminal estiver enviando para o lugar errado (ex: `Carls`), execute o comando abaixo no terminal para corrigir:

```bash
git remote set-url origin https://github.com/lucrativod-dot/Nucleobasquete.git
```

## 🚀 Funcionalidades

- **Gamificação (XP & Ranking):** Sistema de níveis (Novato a MVP) e ranking global/panteão.
- **Treinos Inteligentes:** Séries de exercícios adaptadas ao nível do jogador.
- **Coach Virtual (IA):** Integração com Google Gemini para dicas táticas e técnicas.
- **Vision Board (IA):** Geração de vídeos de visualização mental de jogadas (Google Veo).
- **MyPlayer Lab:** Criação de avatar digital e análise de estilo de jogo.
- **Mapa de Quadras:** Geolocalização de locais para treino.
- **Arena de Contras:** Matchmaking para jogos reais.

## 🛠️ Tecnologias

- **Frontend:** React, TypeScript, Tailwind CSS, Vite.
- **Backend/Auth:** Supabase.
- **AI Core:** Google Gemini API (Flash, Pro & Veo Models).
- **Icons:** Lucide React.

## 📦 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucrativod-dot/Nucleobasquete.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz com suas chaves:
   ```env
   API_KEY=sua_chave_google_gemini
   ```
4. Rode o projeto:
   ```bash
   npm run dev
   ```

## ☁️ Deploy

Este projeto está configurado para deploy automático via **Vercel** ou **Netlify**. Basta conectar este repositório à sua conta de hospedagem.

---
Desenvolvido por **Núcleo Basquete** © 2024.
