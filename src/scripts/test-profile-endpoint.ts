import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function testProfileEndpoint() {
  try {
    console.log('🧪 Testando endpoint /auth/profile...\n');

    // 1. Fazer login como admin
    console.log('1️⃣ Fazendo login como ADMIN...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'brunoholanda',
      password: 'Cc391618*'
    });
    
    const token = loginResponse.data.access_token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login realizado com sucesso');
    console.log('👤 Usuário do login:', user.username);
    console.log('🔑 Tipo de usuário do login:', user.userType);

    // 2. Testar endpoint profile
    console.log('\n2️⃣ Testando endpoint /auth/profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const profileUser = profileResponse.data;
    console.log('✅ Profile obtido com sucesso');
    console.log('👤 Usuário do profile:', profileUser.username);
    console.log('🔑 Tipo de usuário do profile:', profileUser.userType);
    console.log('📋 Profile completo:', JSON.stringify(profileUser, null, 2));

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testProfileEndpoint();
