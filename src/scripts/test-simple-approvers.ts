import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function testSimpleApproversAccess() {
  try {
    console.log('🧪 Testando acesso simples aos aprovadores...\n');

    // Fazer login como usuário simples
    console.log('1️⃣ Fazendo login como USUÁRIO SIMPLES...');
    const simpleLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'usuario.simple',
      password: '123456'
    });
    
    const simpleToken = simpleLoginResponse.data.access_token;
    console.log('✅ Login usuário simples realizado com sucesso');
    console.log(`👤 Tipo de usuário: ${simpleLoginResponse.data.user.userType}`);
    console.log(`🏢 Company ID: ${simpleLoginResponse.data.user.companyId}\n`);

    // Testar GET aprovadores como usuário simples
    console.log('2️⃣ Testando GET /approvers como USUÁRIO SIMPLES...');
    try {
      const simpleApproversResponse = await axios.get(`${API_BASE_URL}/approvers`, {
        headers: {
          'Authorization': `Bearer ${simpleToken}`
        }
      });
      console.log('✅ Usuário simples pode ver aprovadores:', simpleApproversResponse.data.length, 'aprovadores encontrados');
      console.log('📋 Aprovadores:', simpleApproversResponse.data.map(a => a.fullName));
    } catch (error) {
      console.log('❌ ERRO ao acessar aprovadores:', error.response?.data || error.message);
      console.log('🔍 Status:', error.response?.status);
      console.log('🔍 Headers:', error.response?.headers);
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testSimpleApproversAccess();
