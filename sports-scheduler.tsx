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
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="text-md font-semibold text-gray-800 flex items-center">
        <Edit3 className="mr-2 h-4 w-4" />
        Edit Game
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="date"
          value={editData.date}
          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min={new Date().toISOString().split('T')[0]}
        />
        
        <input
          type="time"
          value={editData.time}
          onChange={(e) => setEditData({ ...editData, time: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="text-xs opacity-75">{player.skill}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onSave({ ...editData, court: parseInt(editData.court) })}
          disabled={!editData.date || !editData.time || !editData.court || editData.players.length < 2}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

const EditPlayerForm = ({ player, onSave, onCancel }) => {
  const [editData, setEditData] = useState(player);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <select
          value={editData.skill}
          onChange={(e) => setEditData({ ...editData, skill: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        
        <input
          type="tel"
          value={editData.phone}
          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(editData)}
          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </button>
      </div>
    </div>
  );
};

const AddPlayerForm = React.memo(({ onAddPlayer }) => {
  const [localPlayer, setLocalPlayer] = useState({ name: '', skill: 'Beginner', phone: '' });

  const handleNameChange = useCallback((e) => {
    setLocalPlayer(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleSkillChange = useCallback((e) => {
    setLocalPlayer(prev => ({ ...prev, skill: e.target.value }));
  }, []);

  const handlePhoneChange = useCallback((e) => {
    setLocalPlayer(prev => ({ ...prev, phone: e.target.value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (localPlayer.name.trim()) {
      onAddPlayer(localPlayer);
      setLocalPlayer({ name: '', skill: 'Beginner', phone: '' });
    }
  }, [localPlayer, onAddPlayer]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Plus className="mr-2 h-5 w-5" />
        Add New Player
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Player Name"
          value={localPlayer.name}
          onChange={handleNameChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        
        <select
          value={localPlayer.skill}
          onChange={handleSkillChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        
        <input
          type="tel"
          placeholder="Phone Number"
          value={localPlayer.phone}
          onChange={handlePhoneChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <button
          onClick={handleSubmit}
          disabled={!localPlayer.name.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Player
        </button>
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            New Game
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
                min={new Date().toISOString().split('T')[0]}
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
                  <div className="text-xs opacity-75">{player.skill}</div>
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
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
              onClose();
            }}
            disabled={!newMatch.date || !newMatch.time || !newMatch.court || newMatch.players.length < 2}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
    time: '',
    court: '',
    players: []
  });

  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showNewGameModal, setShowNewGameModal] = useState(false);

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
        setNewMatch({ date: '', time: '', court: '', players: [] });
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
      setEditingPlayer(null);
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

  const ScheduleTab = () => (
    <div className="space-y-6">
      {/* Scheduled Games */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Scheduled Games
          </h3>
        </div>
        
        <div className="space-y-4 p-4 sm:p-6">
          {matches.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No games scheduled yet. Create your first game using "New Game" above!
            </div>
          ) : (
            matches
              .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
              .map(match => (
                <div key={match.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
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
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          {formatDate(match.date)}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-gray-600">
                            <Clock className="mr-1 h-4 w-4" />
                            <span className="font-medium">{formatTime(match.time)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span className="font-medium">{getCourtName(match.court)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Players Row */}
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {match.players.map(playerId => (
                            <span
                              key={playerId}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {getPlayerName(playerId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );

  const PlayersTab = React.memo(() => (
    <div className="space-y-6">
      {/* Add New Player */}
      <AddPlayerForm 
        onAddPlayer={addPlayer}
      />

      {/* Players List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Players ({players.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {players.map(player => (
            <div key={player.id} className="p-6 hover:bg-gray-50 transition-colors">
              {editingPlayer === player.id ? (
                <EditPlayerForm 
                  player={player} 
                  onSave={(updatedPlayer) => updatePlayer(player.id, updatedPlayer)}
                  onCancel={() => setEditingPlayer(null)}
                />
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-medium text-gray-900">{player.name}</div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        player.skill === 'Beginner' ? 'bg-green-100 text-green-800' :
                        player.skill === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {player.skill}
                      </span>
                      {player.phone && <span>{player.phone}</span>}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPlayer(player.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit player"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePlayer(player.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete player"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              🏓 Pickleball Scheduler
            </h1>
            <div className="text-sm text-gray-500">
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
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 pt-4">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'schedule'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-1" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'players'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline h-4 w-4 mr-1" />
              Players
            </button>
            <button
              onClick={() => setShowNewGameModal(true)}
              className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
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
    </div>
  );
};

export default PickleballScheduler;