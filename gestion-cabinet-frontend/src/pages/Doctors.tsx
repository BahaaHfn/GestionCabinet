import React, { useEffect, useState } from 'react';
import api from '../api';
import { Doctor } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, UserPlus, Trash2, X } from 'lucide-react';

export const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  // Creation state
  const [showCreate, setShowCreate] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cin, setCin] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [officePhone, setOfficePhone] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, keyword]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/doctors?keyword=${keyword}&page=${currentPage}&size=10`);
      setDoctors(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        phone,
        cin,
        accountType: 'DOCTOR',
        specialty,
        licenseNumber,
        officePhone,
        officeAddress,
        yearsOfExperience
      });
      setShowCreate(false);
      
      // Clear inputs
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setCin('');
      setSpecialty('');
      setLicenseNumber('');
      setOfficePhone('');
      setOfficeAddress('');
      setYearsOfExperience(0);
      
      fetchDoctors();
    } catch (err) {
      alert('Error registering doctor profile.');
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this doctor profile?')) return;
    try {
      await api.delete(`/doctors/${id}`);
      fetchDoctors();
    } catch (e) {
      alert('Failed to delete doctor.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header bar */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Registry</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage and look up clinical doctor profiles.</p>
        </div>
        
        <button
          onClick={() => setShowCreate(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-sky-100 transition-all flex items-center gap-1.5"
        >
          <UserPlus size={16} /> Add Doctor
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-2">
        <Search size={18} className="text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by specialty..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setCurrentPage(0);
          }}
          className="w-full text-sm outline-none border-none bg-transparent py-1 pr-4 font-medium text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Doctor Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserPlus size={20} className="text-sky-500" />
              Register Doctor Profile
            </h3>

            <form onSubmit={handleCreateDoctor} className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">CIN / ID</label>
                  <input
                    type="text"
                    required
                    value={cin}
                    onChange={e => setCin(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Specialty</label>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    placeholder="e.g. LIC-CARD-12"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Office Phone</label>
                  <input
                    type="text"
                    value={officePhone}
                    onChange={e => setOfficePhone(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Experience (years)</label>
                  <input
                    type="number"
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Office Address</label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={e => setOfficeAddress(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Account Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-slate-500 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Specialty</th>
                <th className="p-4 font-semibold">License</th>
                <th className="p-4 font-semibold">Office Phone</th>
                <th className="p-4 font-semibold">Experience</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((d) => (
                  <tr key={d.idDoctor} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">
                      Dr. {d.user.firstName} {d.user.lastName}
                    </td>
                    <td className="p-4">{d.specialty}</td>
                    <td className="p-4 text-slate-500">{d.licenseNumber}</td>
                    <td className="p-4">{d.officePhone || 'N/A'}</td>
                    <td className="p-4">{d.yearsOfExperience} years</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteDoctor(d.idDoctor)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold">Page {currentPage + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
