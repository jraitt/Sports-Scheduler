import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Clock, MapPin, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { playersAPI, matchesAPI } from './src/supabase';

const EditMatchForm = ({ match, courts, players, onSave, onCancel, onDelete }) => {
  const [editData, setEditData] = useState({
    ...match,
    court: match.court.toString()
  });

  const togglePlayerInEditMatch = (playerId) => {
    const currentPlayers = editData.players;
    if (currentPlayers.includes(playerId)) {
      setEditData({
        ...editData,
        players: currentPlayers.filter(id => id !== playerId)
      });
    } else {
      setEditData({
        ...editData,
        players: [...currentPlayers, playerId]
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-white to-teal-50 rounded-xl border border-teal-200 shadow-inner">
      <h4 className="text-md font-semibold text-slate-800 flex items-center">
        <Edit3 className="mr-2 h-4 w-4 text-teal-600" />
        Edit Game
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="date"
          value={editData.date}
          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="time"
          value={editData.time}
          onChange={(e) => setEditData({ ...editData, time: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          step="900"
        />
        
        <select
          value={editData.court}
          onChange={(e) => setEditData({ ...editData, court: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Court</option>
          {courts.map(court => (
            <option key={court.id} value={court.id}>{court.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Players ({editData.players.length}):
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => togglePlayerInEditMatch(player.id)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                editData.players.includes(player.id)
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onSave({ ...editData, court: parseInt(editData.court) })}
          disabled={!editData.date || !editData.time || !editData.court || editData.players.length < 2}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

const EditPlayerModal = React.memo(({ 
  isOpen, 
  onClose, 
  player,
  onSave,
  onDelete
}) => {
  const [editData, setEditData] = useState(player || { name: '', phone: '' });

  // Update editData when player changes
  React.useEffect(() => {
    if (player) {
      setEditData(player);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-2xl max-w-md w-full border border-teal-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal-200 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-xl">
          <h2 className="text-xl font-semibold text-white flex items-center drop-shadow-sm">
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Player
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/20 rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={!editData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

const AddPlayerModal = React.memo(({ 
  isOpen, 
  onClose, 
  onAddPlayer
}) => {
  const [playerData, setPlayerData] = useState({ name: '', phone: '' });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPlayerData({ name: '', phone: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (playerData.name.trim()) {
      onAddPlayer(playerData);
      setPlayerData({ name: '', phone: '' });
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-2xl max-w-md w-full border border-purple-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl">
          <h2 className="text-xl font-semibold text-white flex items-center drop-shadow-sm">
            <Plus className="mr-2 h-5 w-5" />
            Add New Player
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/20 rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player Name *
              </label>
              <input
                type="text"
                value={playerData.name}
                onChange={(e) => setPlayerData({ ...playerData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter player name"
                autoComplete="off"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={playerData.phone}
                onChange={(e) => setPlayerData({ ...playerData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter phone number (optional)"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!playerData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </button>
        </div>
      </div>
    </div>
  );
});

const NewGameModal = React.memo(({ 
  isOpen, 
  onClose, 
  onSubmit, 
  players, 
  courts, 
  newMatch, 
  setNewMatch, 
  togglePlayerInMatch
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-teal-500 rounded-t-xl">
          <h2 className="text-xl font-semibold text-white flex items-center drop-shadow-sm">
            <Plus className="mr-2 h-5 w-5" />
            New Game
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/20 rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Date, Time, Court Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newMatch.date}
                onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={newMatch.time}
                onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                step="900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court
              </label>
              <select
                value={newMatch.court}
                onChange={(e) => setNewMatch({ ...newMatch, court: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Court</option>
                {courts.map(court => (
                  <option key={court.id} value={court.id}>{court.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Player Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Players ({newMatch.players.length}):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {players.map(player => (
                <button
                  key={player.id}
                  onClick={() => togglePlayerInMatch(player.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                    newMatch.players.includes(player.id)
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {player.name}
                </button>
              ))}
            </div>
            {players.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No players available. Add players first in the Players tab.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-orange-200 bg-gradient-to-r from-orange-50 to-teal-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
              onClose();
            }}
            disabled={!newMatch.date || !newMatch.time || !newMatch.court || newMatch.players.length < 2}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-teal-500 rounded-xl hover:from-orange-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
});

const PickleballScheduler = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [courts] = useState([
    { id: 1, name: 'Sue L', location: 'Backyard' },
    { id: 2, name: 'Hudson', location: 'Rec' },
    { id: 3, name: 'Litchfield', location: 'School' }
  ]);

  const [newMatch, setNewMatch] = useState({
    date: '',
    time: '17:30',
    court: '1',
    players: []
  });

  const [editingMatch, setEditingMatch] = useState(null);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  // Load data from Supabase on component mount
  useEffect(() => {
    loadInitialData();
  }, []);


  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [playersData, matchesData] = await Promise.all([
        playersAPI.getAll(),
        matchesAPI.getAll()
      ]);
      
      setPlayers(playersData);
      setMatches(matchesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
      
      // Fallback to localStorage as backup
      const savedPlayers = localStorage.getItem('pickleball-players');
      const savedMatches = localStorage.getItem('pickleball-matches');
      
      if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
      if (savedMatches) setMatches(JSON.parse(savedMatches));
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async () => {
    if (newMatch.date && newMatch.time && newMatch.court && newMatch.players.length >= 2) {
      try {
        const matchData = {
          ...newMatch,
          court: parseInt(newMatch.court),
          status: 'scheduled'
        };
        
        const createdMatch = await matchesAPI.create(matchData);
        setMatches([...matches, createdMatch]);
        setNewMatch({ date: '', time: '17:30', court: '1', players: [] });
      } catch (err) {
        console.error('Error adding match:', err);
        setError('Failed to add game. Please try again.');
      }
    }
  };

  const deleteMatch = async (id) => {
    try {
      await matchesAPI.delete(id);
      setMatches(matches.filter(match => match.id !== id));
    } catch (err) {
      console.error('Error deleting match:', err);
      setError('Failed to delete game. Please try again.');
    }
  };

  const updateMatch = async (id, updatedMatch) => {
    try {
      const updated = await matchesAPI.update(id, updatedMatch);
      setMatches(matches.map(match => 
        match.id === id ? updated : match
      ));
      setEditingMatch(null);
    } catch (err) {
      console.error('Error updating match:', err);
      setError('Failed to update game. Please try again.');
    }
  };

  const addPlayer = useCallback(async (playerData) => {
    if (playerData.name.trim()) {
      try {
        const createdPlayer = await playersAPI.create(playerData);
        setPlayers(prev => [...prev, createdPlayer]);
      } catch (err) {
        console.error('Error adding player:', err);
        setError('Failed to add player. Please try again.');
      }
    }
  }, []);

  const updatePlayer = async (id, updatedPlayer) => {
    try {
      const updated = await playersAPI.update(id, updatedPlayer);
      setPlayers(players.map(player => 
        player.id === id ? updated : player
      ));
      setShowEditPlayerModal(false);
      setSelectedPlayer(null);
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Failed to update player. Please try again.');
    }
  };

  const deletePlayer = async (id) => {
    try {
      await playersAPI.delete(id);
      setPlayers(players.filter(player => player.id !== id));
      
      // Remove from any scheduled matches
      const updatedMatches = matches.map(match => ({
        ...match,
        players: match.players.filter(playerId => playerId !== id)
      }));
      
      // Update matches in database that had this player
      const matchesToUpdate = matches.filter(match => 
        match.players.includes(id)
      );
      
      for (const match of matchesToUpdate) {
        await matchesAPI.update(match.id, {
          players: match.players.filter(playerId => playerId !== id)
        });
      }
      
      setMatches(updatedMatches);
      setShowEditPlayerModal(false);
      setSelectedPlayer(null);
    } catch (err) {
      console.error('Error deleting player:', err);
      setError('Failed to delete player. Please try again.');
    }
  };

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id);
    return player ? player.name : 'Unknown';
  };

  const getCourtName = (id) => {
    const court = courts.find(c => c.id === id);
    return court ? court.name : 'Unknown';
  };

  const togglePlayerInMatch = (playerId) => {
    const currentPlayers = newMatch.players;
    if (currentPlayers.includes(playerId)) {
      setNewMatch({
        ...newMatch,
        players: currentPlayers.filter(id => id !== playerId)
      });
    } else {
      setNewMatch({
        ...newMatch,
        players: [...currentPlayers, playerId]
      });
    }
  };


  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const ScheduleTab = () => {
    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter matches into future and past
    const futureMatches = matches.filter(match => {
      const matchDate = new Date(match.date + 'T00:00:00');
      return matchDate >= today;
    }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    
    const pastMatches = matches.filter(match => {
      const matchDate = new Date(match.date + 'T00:00:00');
      return matchDate < today;
    }).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

    const renderGamesSection = (gamesList, title, emptyMessage, headerGradient) => (
      <div className="bg-gradient-to-r from-white to-orange-50 rounded-xl shadow-lg border border-orange-100">
        <div className={`p-6 border-b border-orange-200 ${headerGradient} rounded-t-xl`}>
          <h3 className="text-lg font-semibold text-white flex items-center drop-shadow-sm">
            <Calendar className="mr-2 h-5 w-5" />
            {title} ({gamesList.length})
          </h3>
        </div>
        
        <div className="space-y-4 p-4 sm:p-6">
          {gamesList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {emptyMessage}
            </div>
          ) : (
            gamesList.map((match, index) => {
              const cardGradients = [
                'bg-gradient-to-br from-orange-100 to-red-100 border-orange-200',
                'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-200', 
                'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200',
                'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200',
                'bg-gradient-to-br from-green-100 to-teal-100 border-green-200'
              ];
              const cardStyle = cardGradients[index % cardGradients.length];
              
              return (
              <div key={match.id} className={`${cardStyle} rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 backdrop-blur-sm`}>
                {editingMatch === match.id ? (
                  <div className="p-4">
                    <EditMatchForm
                      match={match}
                      courts={courts}
                      players={players}
                      onSave={(updatedMatch) => updateMatch(match.id, updatedMatch)}
                      onCancel={() => setEditingMatch(null)}
                      onDelete={() => deleteMatch(match.id)}
                    />
                  </div>
                ) : (
                  <div 
                    className="p-4 cursor-pointer space-y-3"
                    onClick={() => setEditingMatch(match.id)}
                  >
                    {/* Header Row: Date, Time, Court */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center text-lg font-bold text-slate-800 bg-white/60 rounded-lg px-3 py-1 shadow-sm">
                        <Calendar className="mr-2 h-4 w-4 text-orange-600" />
                        {formatDate(match.date)}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-slate-700 bg-white/60 rounded-lg px-3 py-1 shadow-sm">
                          <Clock className="mr-1 h-4 w-4 text-teal-600" />
                          <span className="font-semibold">{formatTime(match.time)}</span>
                        </div>
                        <div className="flex items-center text-slate-700 bg-white/60 rounded-lg px-3 py-1 shadow-sm">
                          <MapPin className="mr-1 h-4 w-4 text-purple-600" />
                          <span className="font-semibold">{getCourtName(match.court)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Players Row */}
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-slate-600 mt-1 flex-shrink-0" />
                      <div className="flex flex-wrap gap-2">
                        {match.players.map((playerId, playerIndex) => {
                          const playerColors = [
                            'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md',
                            'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md',
                            'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md',
                            'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md',
                            'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md',
                            'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                          ];
                          const playerColor = playerColors[playerIndex % playerColors.length];
                          
                          return (
                          <span
                            key={playerId}
                            className={`${playerColor} px-3 py-1 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200`}
                          >
                            {getPlayerName(playerId)}
                          </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })
          )}
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Scheduled Games */}
        {renderGamesSection(
          futureMatches, 
          "Scheduled Games", 
          "No upcoming games scheduled. Create your first game using 'New Game' above!",
          "bg-gradient-to-r from-orange-500 to-teal-500"
        )}
        
        {/* Previous Games */}
        {renderGamesSection(
          pastMatches,
          "Previous Games",
          "No previous games found.",
          "bg-gradient-to-r from-purple-600 to-indigo-600"
        )}
      </div>
    );
  };

  const PlayersTab = React.memo(() => (
    <div className="space-y-6">
      {/* Players List */}
      <div className="bg-gradient-to-r from-white to-teal-50 rounded-xl shadow-lg border border-teal-100">
        <div className="p-6 border-b border-teal-200 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center drop-shadow-sm">
              <Users className="mr-2 h-5 w-5" />
              Players ({players.length})
            </h3>
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-white text-teal-600 px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center font-semibold border border-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Player
            </button>
          </div>
        </div>
        
        <div className="space-y-4 p-4 sm:p-6">
          {players.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No players added yet. Use the form above to add your first player!
            </div>
          ) : (
            players.map((player, index) => {
              const cardGradients = [
                'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-200',
                'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200', 
                'bg-gradient-to-br from-orange-100 to-red-100 border-orange-200',
                'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200',
                'bg-gradient-to-br from-green-100 to-teal-100 border-green-200'
              ];
              const cardStyle = cardGradients[index % cardGradients.length];
              
              return (
                <div 
                  key={player.id} 
                  className={`${cardStyle} rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 backdrop-blur-sm cursor-pointer`}
                  onClick={() => {
                    setSelectedPlayer(player);
                    setShowEditPlayerModal(true);
                  }}
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-center text-lg font-bold text-slate-800 bg-white/60 rounded-lg px-3 py-2 shadow-sm">
                      <Users className="mr-2 h-4 w-4 text-teal-600" />
                      {player.name}
                    </div>
                    
                    {player.phone && (
                      <div className="flex items-center text-slate-700 bg-white/60 rounded-lg px-3 py-1 shadow-sm">
                        <span className="text-sm">{player.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  ));


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sports scheduler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-teal-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white flex items-center drop-shadow-sm">
              🏓 Pickleball Scheduler
            </h1>
            <div className="text-sm text-orange-100 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <button 
                  onClick={() => {setError(null); loadInitialData();}}
                  className="text-red-600 hover:text-red-800 text-sm mt-1 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-orange-200">
          <nav className="-mb-px flex space-x-8 pt-4">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'schedule'
                  ? 'border-orange-500 text-orange-600 transform scale-105'
                  : 'border-transparent text-slate-600 hover:text-orange-600 hover:border-orange-300'
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-1" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'players'
                  ? 'border-teal-500 text-teal-600 transform scale-105'
                  : 'border-transparent text-slate-600 hover:text-teal-600 hover:border-teal-300'
              }`}
            >
              <Users className="inline h-4 w-4 mr-1" />
              Players
            </button>
            <button
              onClick={() => setShowNewGameModal(true)}
              className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-slate-600 hover:text-yellow-600 hover:border-yellow-300 transition-all duration-200 hover:transform hover:scale-105"
            >
              <Plus className="inline h-4 w-4 mr-1" />
              New Game
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schedule' ? <ScheduleTab /> : <PlayersTab />}
      </div>

      {/* New Game Modal */}
      <NewGameModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onSubmit={addMatch}
        players={players}
        courts={courts}
        newMatch={newMatch}
        setNewMatch={setNewMatch}
        togglePlayerInMatch={togglePlayerInMatch}
      />

      {/* Edit Player Modal */}
      <EditPlayerModal
        isOpen={showEditPlayerModal}
        onClose={() => {
          setShowEditPlayerModal(false);
          setSelectedPlayer(null);
        }}
        player={selectedPlayer}
        onSave={(updatedPlayer) => updatePlayer(selectedPlayer.id, updatedPlayer)}
        onDelete={() => deletePlayer(selectedPlayer.id)}
      />

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onAddPlayer={addPlayer}
      />
    </div>
  );
};

export default PickleballScheduler;