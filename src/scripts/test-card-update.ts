import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function testCardUpdate() {
  try {
    console.log('🧪 Testando atualização de card...\n');

    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'brunoholanda',
      password: 'Cc391618*'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login realizado com sucesso\n');

    // 2. Buscar um card existente
    console.log('2️⃣ Buscando cards existentes...');
    const cardsResponse = await axios.get(`${API_BASE_URL}/cards`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (cardsResponse.data.length === 0) {
      console.log('❌ Nenhum card encontrado para testar');
      return;
    }

    const card = cardsResponse.data[0];
    console.log(`✅ Card encontrado: ${card.title} (ID: ${card.id})\n`);

    // 3. Testar atualização
    console.log('3️⃣ Testando atualização do card...');
    const updatePayload = {
      id: card.id,
      title: "teste sem aprovadores",
      gmudLink: "https://rpetech.atlassian.net/browse/CAN-1556",
      executor: "Time Dev",
      openDate: "2025-10-02T03:00:00.000Z",
      executionForecast: "2025-10-09T03:00:00.000Z",
      status: "aberta",
      companyId: card.companyId,
      approvers: [],
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      approverIds: []
    };

    console.log('📤 Payload enviado:', JSON.stringify(updatePayload, null, 2));

    const updateResponse = await axios.patch(`${API_BASE_URL}/cards/${card.id}`, updatePayload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Card atualizado com sucesso!');
    console.log('📥 Resposta:', JSON.stringify(updateResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    if (error.response?.data) {
      console.log('🔍 Status:', error.response.status);
      console.log('🔍 Headers:', error.response.headers);
    }
  }
}

testCardUpdate();
