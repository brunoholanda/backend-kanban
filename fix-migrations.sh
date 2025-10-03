#!/bin/bash

# Script para corrigir o estado das migrations após remoção da migration duplicada

set -e  # Parar em caso de erro

echo "🔧 Corrigindo estado das migrations após remoção da migration duplicada"
echo ""

echo "🔍 Verificando migrations disponíveis..."
ls -la src/migrations/

echo ""
echo "🔄 Limpando estado das migrations no banco..."

# Verificar se há tabela de migrations
MIGRATIONS_TABLE_EXISTS=$(npm run typeorm -- query "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'migrations')" --format json | jq -r '.[0].exists')

if [ "$MIGRATIONS_TABLE_EXISTS" = "true" ]; then
    echo "📋 Migrations registradas no banco:"
    npm run typeorm -- query "SELECT name FROM migrations ORDER BY timestamp" --format json | jq -r '.[].name' || echo "Nenhuma migration registrada"
    
    echo ""
    echo "🔄 Removendo registros de migrations duplicadas..."
    
    # Remover registros de migrations duplicadas
    npm run typeorm -- query "DELETE FROM migrations WHERE name = 'AddUserTypeColumn1700000000000'" > /dev/null 2>&1 || true
    
    echo "✅ Registros de migrations duplicadas removidos"
else
    echo "ℹ️  Tabela de migrations não existe"
fi

echo ""
echo "🔄 Executando migrations..."

# Executar migrations
npm run migration:run

if [ $? -eq 0 ]; then
    echo "✅ Migrations executadas com sucesso!"
    echo ""
    echo "📋 Status final das migrations:"
    npm run migration:show
    echo ""
    echo "📋 Tabelas criadas:"
    npm run typeorm -- query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    
    echo ""
    echo "📋 Estrutura da tabela users:"
    npm run typeorm -- query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"
    
else
    echo "❌ Erro ao executar migrations!"
    echo "📋 Verifique os logs acima para mais detalhes"
    exit 1
fi

echo ""
echo "🎉 Migrations corrigidas e executadas com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verificar se a aplicação está funcionando"
echo "   2. Testar login e funcionalidades"
echo "   3. Criar dados iniciais se necessário"
