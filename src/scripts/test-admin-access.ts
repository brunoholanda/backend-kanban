import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function testAdminAccess() {
  try {
    console.log('🧪 Testando acesso de usuário admin...\n');

    // 1. Fazer login como admin
    console.log('1️⃣ Fazendo login como ADMIN...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'brunoholanda',
      password: 'Cc391618*'
    });
    
    const token = loginResponse.data.access_token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login admin realizado com sucesso');
    console.log('👤 Usuário:', user.username);
    console.log('🔑 Tipo de usuário:', user.userType);
    console.log('🏢 Company ID:', user.companyId);
    console.log('🎫 Token:', token.substring(0, 20) + '...\n');

    // 2. Testar acesso aos aprovadores (deve funcionar)
    console.log('2️⃣ Testando acesso aos aprovadores...');
    try {
      const approversResponse = await axios.get(`${API_BASE_URL}/approvers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Admin pode ver aprovadores:', approversResponse.data.length, 'encontrados');
    } catch (error) {
      console.log('❌ ERRO ao acessar aprovadores:', error.response?.data || error.message);
    }

    // 3. Testar criação de aprovador (deve funcionar)
    console.log('\n3️⃣ Testando criação de aprovador...');
    try {
      const createApproverResponse = await axios.post(`${API_BASE_URL}/approvers`, {
        firstName: 'Teste',
        lastName: 'Admin'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Admin pode criar aprovador:', createApproverResponse.data.fullName);
    } catch (error) {
      console.log('❌ ERRO ao criar aprovador:', error.response?.data || error.message);
    }

    // 4. Testar acesso aos cards (deve funcionar)
    console.log('\n4️⃣ Testando acesso aos cards...');
    try {
      const cardsResponse = await axios.get(`${API_BASE_URL}/cards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Admin pode ver cards:', cardsResponse.data.length, 'encontrados');
      
      if (cardsResponse.data.length > 0) {
        const card = cardsResponse.data[0];
        console.log(`📋 Primeiro card: ${card.title} (ID: ${card.id})`);
        
        // 5. Testar exclusão de card (deve funcionar)
        console.log('\n5️⃣ Testando exclusão de card...');
        try {
          await axios.delete(`${API_BASE_URL}/cards/${card.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Admin pode excluir card');
        } catch (error) {
          console.log('❌ ERRO ao excluir card:', error.response?.data || error.message);
        }
      }
    } catch (error) {
      console.log('❌ ERRO ao acessar cards:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral no teste:', error.response?.data || error.message);
  }
}

testAdminAccess();
