import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CustomFetchForUseQuery from './Utils/CustomFetchForUseQuery'; // Poprawiona ścieżka importu

function Panel() {
  console.log('Panel mounted');

  // Stan dla nazwy użytkownika i hasła
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Stan dla uprawnień
  const [permissions, setPermissions] = useState({
    canAddProduct: false,
    canDeleteProduct: false,
    canEditProduct: false,
    canEditCategory: false,
  });

  // Stan dla komunikatu (sukces/błąd)
  const [message, setMessage] = useState('');
  
  // React Query Client
  const queryClient = useQueryClient();

  // Zmiana uprawnień
  const handlePermissionChange = (name) => (event) => {
    setPermissions((prev) => ({
      ...prev,
      [name]: event.target.checked,
    }));
  };

  // Mutacja do wysyłania danych do API
  const mutation = useMutation(
    (newData) => CustomFetchForUseQuery(`users/add`, 'POST', newData)(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['usersList']) // Odświeżenie listy użytkowników po dodaniu
          .then(() => setMessage('Sukces: Użytkownik został dodany'))
          .catch(() => setMessage('Błąd: Nie udało się odświeżyć listy użytkowników.'));
        
        // Resetowanie formularza
        setUsername('');
        setPassword('');
        setPermissions({
          canAddProduct: false,
          canDeleteProduct: false,
          canEditProduct: false,
          canEditCategory: false,
        });
      },
      onError: (error) => {
        setMessage(`Błąd: ${error.message || 'Wystąpił nieznany błąd'}`);
      },
    }
  );

  // Funkcja obsługująca zapis użytkownika
  const save = (e) => {
    e.preventDefault();
    const newData = {
      username,
      password,
      ...permissions,
    };
    mutation.mutate(newData);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '20px' }}>Panel Administracyjny</h1>

      <section
        id="addUserSection"
        style={{
          background: '#ECF0F1',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#2980B9', marginBottom: '20px' }}>Dodaj użytkownika</h2>

        <form id="addUserForm" onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ fontWeight: 'bold', color: '#34495E' }}>
            Nazwa użytkownika:
            <input
              type="text"
              name="username"
              required
              placeholder="Wprowadź nazwę użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #BDC3C7' }}
            />
          </label>

          <label style={{ fontWeight: 'bold', color: '#34495E' }}>
            Hasło:
            <input
              type="password"
              name="password"
              required
              placeholder="Wprowadź hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #BDC3C7' }}
            />
          </label>

          <h3 style={{ color: '#34495E', marginBottom: '10px' }}>Uprawnienia:</h3>

          {['canAddProduct', 'canDeleteProduct', 'canEditProduct', 'canEditCategory'].map((permission) => (
            <div
              key={permission}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '10px 0',
              }}
            >
              <span style={{ color: '#2C3E50', fontWeight: 'bold' }}>
                {permission.replace('can', 'Może ').replace('Product', ' produkt').replace('Category', ' kategorię')}
              </span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                <span>Nie</span>
                <input
                  type="checkbox"
                  checked={permissions[permission]}
                  onChange={handlePermissionChange(permission)}
                  style={{
                    width: '50px',
                    height: '24px',
                    appearance: 'none',
                    backgroundColor: permissions[permission] ? '#27AE60' : '#BDC3C7',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background-color 0.3s',
                    position: 'relative',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: permissions[permission] ? 'calc(100% - 22px)' : '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    transition: 'left 0.3s',
                  }}
                ></span>
                <span>Tak</span>
              </label>
            </div>
          ))}

          <button
            type="submit"
            style={{
              background: '#27AE60',
              color: '#FFF',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Dodaj użytkownika
          </button>
        </form>
        {message && (
          <p style={{ marginTop: '20px', color: message.startsWith('Błąd') ? 'red' : '#2C3E50' }}>{message}</p>
        )}
      </section>
    </div>
  );
}

export default Panel;
