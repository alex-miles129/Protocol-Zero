'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationType } from '../../types/applications';
import { getApplications, updateApplicationStatus } from '../../services/applicationService';
import { applicationForms } from '../../config/applicationForms';

interface ApplicationsManagerProps {
  type: ApplicationType;
  currentUser: string;
}

const ApplicationsManager: React.FC<ApplicationsManagerProps> = ({
  type,
  currentUser
}) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  const config = applicationForms[type];

  useEffect(() => {
    loadApplications();
  }, [type]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications(type);
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (index: number, status: 'approved' | 'rejected') => {
    try {
      await updateApplicationStatus(type, index, status, currentUser);
      await loadApplications(); // Reload the list
      setError(null);
    } catch (err) {
      setError('Failed to update application status');
      console.error(err);
    }
  };

  const renderApplicationDetails = (application: any) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Application Details</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Submitted At</p>
            <p>{new Date(application.submittedAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className={`font-semibold ${
              application.status === 'approved' ? 'text-green-600' :
              application.status === 'rejected' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {application.status.toUpperCase()}
            </p>
          </div>
          {application.reviewedBy && (
            <>
              <div>
                <p className="text-gray-600">Reviewed By</p>
                <p>{application.reviewedBy}</p>
              </div>
              <div>
                <p className="text-gray-600">Reviewed At</p>
                <p>{new Date(application.reviewedAt).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">OOC Information</h4>
            {config.questions
              .filter(q => q.section === 'ooc')
              .map(question => (
                <div key={question.id} className="mb-4">
                  <p className="text-gray-600">{question.label}</p>
                  <p className="mt-1">{application[question.id]}</p>
                </div>
              ))}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">IC Information</h4>
            {config.questions
              .filter(q => q.section === 'ic')
              .map(question => (
                <div key={question.id} className="mb-4">
                  <p className="text-gray-600">{question.label}</p>
                  <p className="mt-1">{application[question.id]}</p>
                </div>
              ))}
          </div>
        </div>

        {application.status === 'pending' && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => handleStatusUpdate(applications.indexOf(application), 'approved')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate(applications.indexOf(application), 'rejected')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={loadApplications}
          className="ml-4 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{config.title} Applications</h2>
      
      {applications.length === 0 ? (
        <p className="text-center py-8 text-gray-600">No applications found</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y">
              {applications.map((app, index) => (
                <div
                  key={index}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedApplication === app ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedApplication(app)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{app.discordName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            {selectedApplication ? (
              renderApplicationDetails(selectedApplication)
            ) : (
              <div className="text-center py-8 text-gray-600">
                Select an application to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManager; 