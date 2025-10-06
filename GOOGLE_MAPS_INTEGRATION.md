# Integração Google Maps - Ceará por Temporada

Esta documentação explica como configurar e usar a integração completa com Google Maps no sistema de cadastro de imóveis.

## 🚀 Funcionalidades Implementadas

### 1. Componente de Input Google Maps (`GoogleMapsInput`)

- **Localização**: `src/components/google-maps-input.tsx`
- **Funcionalidades**:
  - Autocomplete de endereços com API do Google Places
  - Mapa interativo para seleção de localização
  - Marcador arrastável para ajuste preciso
  - Reverse geocoding (coordenadas → endereço)
  - Busca por texto livre
  - Restrição de pesquisa ao Brasil
  - Interface integrada ao formulário

### 2. Componente de Exibição de Mapa (`GoogleMapDisplay`)

- **Localização**: `src/components/google-map-display.tsx`
- **Funcionalidades**:
  - Exibição do mapa com marcador personalizado
  - Fallback para iframe embed se coordenadas não disponíveis
  - Controles de zoom e Street View
  - Marcador vermelho personalizado
  - Responsivo e integrado ao design

### 3. Campos de Banco de Dados Adicionados

Novos campos na tabela `property_location`:

```sql
googleMapsUrl        TEXT    -- URL direta do Google Maps
googlePlaceId        VARCHAR -- Place ID único do Google
googleMapsEmbedUrl   TEXT    -- URL para embed iframe
```

### 4. Integração no Formulário

- Atualização automática de coordenadas (latitude/longitude)
- Salvamento de URLs e Place ID
- Validação de dados do Maps
- Interface unificada no processo de cadastro

## 🔑 Chaves de API Necessárias

Para que a integração funcione completamente, você precisa adquirir as seguintes chaves da Google Cloud Platform:

### 1. Google Maps JavaScript API Key

- **Serviço**: Maps JavaScript API
- **Uso**: Renderização dos mapas interativos
- **Cotas**: Gratuito até 28.000 carregamentos/mês

### 2. Google Places API Key

- **Serviço**: Places API (New)
- **Uso**: Autocomplete de endereços e busca de locais
- **Cotas**: Gratuito até 2.500 requisições/mês (Autocomplete)

### 3. Google Maps Embed API Key

- **Serviço**: Maps Embed API
- **Uso**: Iframes de mapas para fallback
- **Cotas**: Gratuito e ilimitado

## ⚙️ Como Configurar as APIs

### Passo 1: Criar Projeto no Google Cloud Platform

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative o faturamento (mesmo para uso gratuito)

### Passo 2: Ativar as APIs Necessárias

```bash
# Navegue até "APIs e Serviços" > "Biblioteca" e ative:
- Maps JavaScript API
- Places API (New)
- Maps Embed API
- Geocoding API
```

### Passo 3: Criar Chave de API

1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "Chave de API"
3. **Importante**: Restrinja a chave por domínio/IP para segurança

### Passo 4: Configurar Restrições (Segurança)

```javascript
// Restrições recomendadas:
Tipo: Referenciadores HTTP (sites)
Referenciadores de sites:
- localhost:3000/*
- seudominio.com/*
- *.seudominio.com/*

APIs restritas:
✓ Maps JavaScript API
✓ Places API
✓ Maps Embed API
✓ Geocoding API
```

### Passo 5: Configurar Variável de Ambiente

```bash
# No arquivo .env do projeto:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua_chave_aqui"
```

## 💰 Estimativa de Custos

### Uso Gratuito Mensal (Sufficient for MVP):

- **Maps JavaScript API**: 28.000 carregamentos
- **Places Autocomplete**: 2.500 sessões
- **Maps Embed API**: Ilimitado e gratuito
- **Geocoding API**: 40.000 requisições

### Custos após Limites Gratuitos:

- **Maps JavaScript API**: $7 por 1.000 carregamentos adicionais
- **Places Autocomplete**: $17 por 1.000 sessões adicionais
- **Geocoding API**: $5 por 1.000 requisições adicionais

### Para uma plataforma de imóveis pequena/média:

- **Estimativa mensal**: $0 - $50 (dentro dos limites gratuitos)
- **Estimativa com crescimento**: $100 - $300/mês

## 🏗️ Estrutura de Arquivos

```
src/
├── components/
│   ├── google-maps-input.tsx      # Input com autocomplete e mapa
│   └── google-map-display.tsx     # Componente de visualização
├── app/
│   └── proprietario/[id]/imoveis/
│       └── cadastrar/
│           └── page.tsx           # Formulário integrado
├── lib/
│   └── property-actions.ts       # Ações do servidor (CRUD)
└── db/
    └── schema.ts                 # Schema do banco de dados

drizzle/
└── 0020_nifty_wolverine.sql      # Migration com novos campos
```

## 🧪 Como Testar

### 1. Teste Local

```bash
# Executar o projeto
npm run dev

# Navegar para o formulário
http://localhost:3000/proprietario/[id]/imoveis/cadastrar
```

### 2. Teste de Funcionalidades

- ✅ Busca por autocomplete (ex: "Fortaleza, CE")
- ✅ Arrastar marcador no mapa
- ✅ Busca por texto livre
- ✅ Salvamento de coordenadas
- ✅ Exibição do mapa na visualização do imóvel

### 3. Teste de Fallbacks

- ✅ Sem chave de API (deve mostrar input simples)
- ✅ Sem coordenadas (deve mostrar iframe embed)
- ✅ Erro de rede (deve mostrar mensagem de erro)

## 🔧 Comandos Drizzle Utilizados

```bash
# Gerar migration após mudanças no schema
npx drizzle-kit generate

# Aplicar migrations ao banco
npx drizzle-kit push

# Abrir Drizzle Studio para visualizar dados
npx drizzle-studio
```

## 📝 Variáveis de Ambiente Necessárias

```env
# Banco de dados
DATABASE_URL="sua_string_de_conexao_postgres"

# Google Maps (OBRIGATÓRIO para funcionamento)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua_chave_google_maps"

# Cloudinary (para upload de imagens)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

## 🚨 Próximos Passos

1. **Obter chave do Google Maps** e substitui no `.env`
2. **Testar todas as funcionalidades** no ambiente local
3. **Configurar restrições de API** para produção
4. **Monitorar uso da API** no Google Cloud Console
5. **Implementar cache** para otimizar requisições (opcional)

## 🔒 Considerações de Segurança

- ✅ Chave de API restrita por domínio
- ✅ Prefix `NEXT_PUBLIC_` apenas para APIs do frontend
- ✅ Validação de dados no servidor
- ✅ Rate limiting implementado pelo Google
- ⚠️ Monitorar uso para evitar custos inesperados

## 📞 Suporte

Em caso de dúvidas sobre a implementação, consulte:

- [Documentação oficial Google Maps](https://developers.google.com/maps)
- [Documentação Drizzle ORM](https://orm.drizzle.team/)
- [Documentação Next.js](https://nextjs.org/docs)
