'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { ApplicationDetails } from "@/components/admin/ApplicationDetails";
import { Application } from "@/types/applications";
import { AdminUser } from '@/config/admins';

interface ApplicationSection {
  id: string;
  title: string;
  description: string;
  type: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAccess, setAdminAccess] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string>('whitelist');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved'>('pending');

  const applicationSections: ApplicationSection[] = [
    {
      id: 'whitelist',
      title: 'Whitelist Applications',
      description: 'Review general server whitelist applications',
      type: 'whitelist'
    },
    {
      id: 'ems',
      title: 'EMS Applications',
      description: 'Review Emergency Medical Services department applications',
      type: 'ems'
    },
    {
      id: 'police',
      title: 'Police Applications',
      description: 'Review Law Enforcement department applications',
      type: 'police'
    },
    {
      id: 'doj',
      title: 'DOJ Applications',
      description: 'Review Department of Justice applications including lawyers and judges',
      type: 'doj'
    },
    {
      id: 'doc',
      title: 'DOC Applications',
      description: 'Review Department of Corrections staff applications',
      type: 'doc'
    }
  ];

  // Function to fetch applications
  const fetchApplications = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/applications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Successfully fetched applications:', data);
        setApplications(data.applications);
      } else {
        console.error('Failed to fetch applications:', data.error);
        setError(data.error || 'Failed to fetch applications');
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch applications',
          variant: 'destructive',
          duration: 3000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error fetching applications:', error);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/admin/check');
          const data = await response.json();
          setIsAdmin(data.isAdmin);
          if (data.isAdmin) {
            setAdminAccess({
              discordId: data.discordId,
              designation: data.designation
            });
            // Set initial section if user has limited access
            if (data.designation !== 'all') {
              setSelectedSection(data.designation);
            }
            await fetchApplications();
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          router.push('/');
        } finally {
          setIsLoading(false);
        }
      } else if (status !== "loading") {
        router.push('/');
      }
    };

    checkAdminStatus();
  }, [session, status, router]);

  // Set up periodic refresh
  useEffect(() => {
    if (isAdmin) {
      const interval = setInterval(fetchApplications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handleAction = async (application: Application, action: 'approved' | 'rejected') => {
    try {
      setIsProcessing(true);
      
      toast({
        title: 'Processing',
        description: `Processing application ${action === 'approved' ? 'approval' : 'rejection'}...`,
        duration: 2000,
      });

      const response = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: application.id,
          type: application.type,
          status: action
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: `Application ${action} successfully`,
          variant: 'default',
          duration: 3000,
        });

        await fetchApplications();
        setSelectedApp(null);
      } else {
        throw new Error(data.error || 'Failed to process application');
      }
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred while processing the application.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter sections based on admin designation
  const visibleSections = applicationSections.filter(section => 
    adminAccess?.designation === 'all' || adminAccess?.designation === section.id
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">Loading...</h2>
          <p className="text-xs text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2 text-red-500">Error</h2>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button 
            onClick={fetchApplications}
            className="mt-4 text-xs"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const filteredApplications = applications.filter(app => 
    app.type === selectedSection && 
    (selectedStatus === 'pending' ? app.status === 'pending' : app.status !== 'pending')
  );

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          {adminAccess && (
            <div className="text-xs text-muted-foreground">
              {adminAccess.designation === 'all' ? 'Full Access' : `${adminAccess.designation.charAt(0).toUpperCase() + adminAccess.designation.slice(1)} Access`}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
          {/* Application Type Selection - Non-scrollable */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 flex-shrink-0">
            {visibleSections.map((section) => (
              <Card 
                key={section.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedSection === section.id ? "border-primary ring-2 ring-primary" : ""
                )}
                onClick={() => setSelectedSection(section.id)}
              >
                <CardHeader className="space-y-1 p-4">
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                  <CardDescription className="text-xs">{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">
                    {applications.filter(app => app.type === section.type && app.status === 'pending').length} pending
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Scrollable Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Applications List */}
            <Card className="bg-card/50 backdrop-blur flex flex-col overflow-hidden">
              <CardHeader className="space-y-1 flex-shrink-0 p-4">
                <CardTitle className="text-base">
                  {applicationSections.find(s => s.id === selectedSection)?.title || 'Applications'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {applicationSections.find(s => s.id === selectedSection)?.description || 'Review applications'}
                </CardDescription>
                <Tabs defaultValue="pending" className="w-full" onValueChange={(value) => setSelectedStatus(value as 'pending' | 'approved')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                    <TabsTrigger value="approved" className="text-xs">Processed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {filteredApplications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-muted-foreground mb-2">No {selectedStatus} applications</p>
                        <p className="text-[10px] text-muted-foreground">
                          New applications will appear here automatically
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground mb-4">
                          {filteredApplications.length} {selectedStatus} application(s)
                        </p>
                        {filteredApplications.map((app) => (
                          <div key={`${app.type}-${app.id}`}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start px-3 py-2 text-xs",
                                selectedApp?.id === app.id && "bg-accent"
                              )}
                              onClick={() => setSelectedApp(app)}
                            >
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-medium">Application from {app.username || 'Unknown'}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(app.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </Button>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Application Details */}
            <Card className="bg-card/50 backdrop-blur flex flex-col overflow-hidden">
              <CardHeader className="space-y-1 flex-shrink-0 p-4">
                <CardTitle className="text-base">Application Details</CardTitle>
                <CardDescription className="text-xs">Review and process the selected application</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full">
                  <div className="pr-4">
                    {selectedApp ? (
                      <>
                        <ApplicationDetails application={selectedApp} />
                        
                        {selectedApp.status === 'pending' && (
                          <div className="mt-6 flex gap-4 sticky bottom-0 bg-background p-4 border-t">
                            <Button
                              className="flex-1 text-xs"
                              variant="default"
                              onClick={() => handleAction(selectedApp, 'approved')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button
                              className="flex-1 text-xs"
                              variant="destructive"
                              onClick={() => handleAction(selectedApp, 'rejected')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-xs text-muted-foreground">
                          Select an application to view details
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t flex-shrink-0 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] text-center text-muted-foreground">
            © {new Date().getFullYear()} Protocol: Zero. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 