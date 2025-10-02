import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function testApproversAccess() {
  try {
    console.log('🧪 Testando acesso aos aprovadores...\n');

    // 1. Fazer login como usuário admin
    console.log('1️⃣ Fazendo login como ADMIN...');
    const adminLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'brunoholanda',
      password: '123456' // Assumindo que esta é a senha
    });
    
    const adminToken = adminLoginResponse.data.access_token;
    console.log('✅ Login admin realizado com sucesso');
    console.log(`👤 Tipo de usuário: ${adminLoginResponse.data.user.userType}\n`);

    // 2. Testar GET aprovadores como admin
    console.log('2️⃣ Testando GET /approvers como ADMIN...');
    const adminApproversResponse = await axios.get(`${API_BASE_URL}/approvers`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Admin pode ver aprovadores:', adminApproversResponse.data.length, 'aprovadores encontrados\n');

    // 3. Fazer login como usuário simples
    console.log('3️⃣ Fazendo login como USUÁRIO SIMPLES...');
    const simpleLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'usuario.simple',
      password: '123456' // Assumindo que esta é a senha
    });
    
    const simpleToken = simpleLoginResponse.data.access_token;
    console.log('✅ Login usuário simples realizado com sucesso');
    console.log(`👤 Tipo de usuário: ${simpleLoginResponse.data.user.userType}\n`);

    // 4. Testar GET aprovadores como usuário simples
    console.log('4️⃣ Testando GET /approvers como USUÁRIO SIMPLES...');
    const simpleApproversResponse = await axios.get(`${API_BASE_URL}/approvers`, {
      headers: {
        'Authorization': `Bearer ${simpleToken}`
      }
    });
    console.log('✅ Usuário simples pode ver aprovadores:', simpleApproversResponse.data.length, 'aprovadores encontrados\n');

    // 5. Testar POST aprovadores como usuário simples (deve falhar)
    console.log('5️⃣ Testando POST /approvers como USUÁRIO SIMPLES (deve falhar)...');
    try {
      await axios.post(`${API_BASE_URL}/approvers`, {
        firstName: 'Teste',
        lastName: 'Simples'
      }, {
        headers: {
          'Authorization': `Bearer ${simpleToken}`
        }
      });
      console.log('❌ ERRO: Usuário simples conseguiu criar aprovador (não deveria)');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ CORRETO: Usuário simples não pode criar aprovadores (403 Forbidden)');
      } else {
        console.log('❌ ERRO inesperado:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testApproversAccess();
