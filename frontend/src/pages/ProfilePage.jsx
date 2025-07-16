import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, MapPin, Phone, Briefcase, GraduationCap, Award, Code, Heart, Languages, FileText, Edit3, Eye, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/auth.store.js';
import CV from '../components/CV.jsx';
import { axiosConfig } from '../config/axios.config.js';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router';

const ProfilePage = () => {
    const { authUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState(true);
    const [resume, setResume] = useState(null);

    const navigate = useNavigate();

    const getUserCV = async () => {
        try {
            const response = await axiosConfig.get("http://localhost:3000/api/v1/cv");

            setResume(response.data?.data);
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        getUserCV();
    }, [authUser]);

    if (!authUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const ProfileSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-lg">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                        {authUser.imageUrl ? (
                            <img
                                src={authUser.imageUrl}
                                alt={authUser.username}
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-500 flex items-center justify-center">
                                <User className="w-12 h-12 text-white" />
                            </div>
                        )}
                        <button className="absolute -bottom-2 -right-2 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold mb-2">{authUser.username}</h1>
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                            <div className="flex items-center justify-center md:justify-start">
                                <Mail className="w-4 h-4 mr-2" />
                                <span className="text-blue-100">{authUser.email}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="text-blue-100">Joined {formatDate(authUser.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Username</span>
                                <span className="font-medium text-gray-900">{authUser.username}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium text-gray-900">{authUser.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Account Created</span>
                                <span className="font-medium text-gray-900">{formatDate(authUser.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-gray-600">Last Updated</span>
                                <span className="font-medium text-gray-900">{formatDate(authUser.updated_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" />
                            Description
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                            {authUser.description ? (
                                <p className="text-gray-700 leading-relaxed">{authUser.description}</p>
                            ) : (
                                <p className="text-gray-500 italic">No description provided yet.</p>
                            )}
                        </div>
                        <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center">
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit Description
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Resume</h3>
                    <div className="flex flex-wrap gap-4">
                        {resume
                            ?
                            <CV data={resume} />
                            :
                            <div className='w-[100%] flex flex-col justify-center items-center gap-4'>
                                <div className="text-neutral-500">
                                    Doesn't have resume yet? Upload now
                                </div>
                                <div className='bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center' onClick={() => navigate("/upload")}>
                                    Upload Your Resume
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab(true)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === true
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <User className="w-4 h-4 inline mr-2" />
                                Profile
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                {activeTab === true && <ProfileSection />}
            </div>
        </div>
    );
};

export default ProfilePage;