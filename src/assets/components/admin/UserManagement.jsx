import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../../Auth/AuthContext';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(null);
  const [currentUser, setCurrentUser] = useState({ 
    id: null, 
    username: '', 
    email: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useContext(AuthContext);
  const usersPerPage = 5;

  // Charger les utilisateurs
  const fetchUsers = async () => {
    console.log("fetch")
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Ajouter un utilisateur
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:8080/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: currentUser.username,
          email: currentUser.email,
          password: currentUser.password
        })
      });

      if (response.ok) {
        
        const newUser = await response.json();
        console.log(newUser)
        setUsers([...users, newUser]);
        setModalOpen(null);
        setCurrentUser({ id: null, username: '', email: '', password: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la création');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier un utilisateur
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/update-user/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: currentUser.username,
          email: currentUser.email,
          password: currentUser.password || undefined // Ne pas envoyer si vide
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        setSuccess('');
        setModalOpen(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
        setSuccess('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer plusieurs utilisateurs
  const handleDeleteSelected = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Implémentez la suppression multiple si votre backend le supporte
      // Ici, on supprime un par un pour l'exemple
      await Promise.all(
        selectedUsers.map(id => 
          fetch(`http://localhost:8080/api/admin/delete-user/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );
      
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      setError('Erreur lors de la suppression multiple');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions utilitaires
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(currentUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id) 
        : [...prev, id]
    );
  };

  const openModal = (modal, user = null) => {
    setCurrentUser(user || { id: null, username: '', email: '', password: '' });
    setModalOpen(modal);
    setError('');
    setSuccess('');
  };

  // Filtrage et pagination
  const filteredUsers = users.filter(user =>
    Object.values(user).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container">
      {isLoading && <div className="loading-overlay">Chargement...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-wrapper">
        <div className="table-title">
          <div className="row">
            <div className="col-sm-6">
              <h2><b>Gestion Utilisateurs</b></h2>
            </div>
            <div className="col-sm-6">
              <button 
                className="btn btn-success"
                onClick={() => openModal('add')}
                disabled={isLoading}
              >
                <FaPlus /> <span>Ajouter Utilisateur</span>
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteSelected}
                disabled={!selectedUsers.length || isLoading}
              >
                <FaTrash /> <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <span className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    id="selectAll"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAll}
                    disabled={isLoading}
                  />
                  <label htmlFor="selectAll"></label>
                </span>
              </th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <span className="custom-checkbox">
                      <input
                        type="checkbox"
                        id={`checkbox${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        disabled={isLoading}
                      />
                      <label htmlFor={`checkbox${user.id}`}></label>
                    </span>
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      className="edit"
                      onClick={() => openModal('edit', user)}
                      disabled={isLoading}
                    >
                      <FaEdit title="Modifier" />
                    </button>
                    <button
                      className="delete"
                      onClick={() => openModal('delete', user)}
                      disabled={isLoading}
                    >
                      <FaTrash title="Supprimer" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  {isLoading ? 'Chargement...' : 'Aucun utilisateur trouvé'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="clearfix">
          <div className="hint-text">
            Affichage de <b>{currentUsers.length}</b> sur <b>{filteredUsers.length}</b> utilisateurs
          </div>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={isLoading}
              >
                Précédent
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li 
                key={i} 
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              >
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={isLoading}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={isLoading}
              >
                Suivant
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal Ajout */}
      {modalOpen === 'add' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleAddUser}>
                <div className="modal-header">
                  <h4 className="modal-title">Ajouter Utilisateur</h4>
                  <button 
                    type="button" 
                    className="close"
                    onClick={() => setModalOpen(null)}
                    disabled={isLoading}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentUser.username}
                      onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={currentUser.email}
                      onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentUser.password}
                      onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setModalOpen(null)}
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? 'En cours...' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {modalOpen === 'edit' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleUpdateUser}>
                <div className="modal-header">
                  <h4 className="modal-title">Modifier Utilisateur</h4>
                  <button 
                    type="button" 
                    className="close"
                    onClick={() => setModalOpen(null)}
                    disabled={isLoading}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentUser.username}
                      onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={currentUser.email}
                      onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentUser.password || ''}
                      onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setModalOpen(null)}
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'En cours...' : 'Modifier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {modalOpen === 'delete' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleDeleteUser(currentUser.id);
              }}>
                <div className="modal-header">
                  <h4 className="modal-title">Supprimer Utilisateur</h4>
                  <button 
                    type="button" 
                    className="close"
                    onClick={() => setModalOpen(null)}
                    disabled={isLoading}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {currentUser.username} ?</p>
                  <p className="text-warning">
                    <small>Cette action est irréversible.</small>
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setModalOpen(null)}
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-danger"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;