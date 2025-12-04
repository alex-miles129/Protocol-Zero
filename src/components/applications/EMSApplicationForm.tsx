"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

export function EMSApplicationForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // OOC Information
    discordId: '',
    characterName: '',
    age: '',
    timezone: '',
    previousExperience: '',
    whyEMS: '',
    availability: '',
    
    // IC Information
    medicalBackground: '',
    specializations: '',
    emergencyScenario: '',
    teamworkExample: '',
    stressManagement: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications/ems/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ems',
          formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'Your EMS application has been submitted successfully.',
          variant: 'success',
          duration: 5000,
        });
        setOpen(false);
        setFormData({
          discordId: '',
          characterName: '',
          age: '',
          timezone: '',
          previousExperience: '',
          whyEMS: '',
          availability: '',
          medicalBackground: '',
          specializations: '',
          emergencyScenario: '',
          teamworkExample: '',
          stressManagement: '',
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          Apply for EMS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">EMS Department Application</DialogTitle>
          <DialogDescription>
            Apply to join our Emergency Medical Services team. Please fill out all required fields carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* OOC Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Out of Character Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="discordId" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Discord ID
                </Label>
                <Input
                  id="discordId"
                  required
                  value={formData.discordId}
                  onChange={(e) => handleInputChange('discordId', e.target.value)}
                  placeholder="Your Discord ID (e.g., username#1234)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="characterName" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Character Name
                </Label>
                <Input
                  id="characterName"
                  required
                  value={formData.characterName}
                  onChange={(e) => handleInputChange('characterName', e.target.value)}
                  placeholder="Your character's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Timezone
                </Label>
                <Input
                  id="timezone"
                  required
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  placeholder="Your timezone (e.g., EST, GMT+1)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousExperience" className="text-base">
                  Previous RP Experience
                </Label>
                <Textarea
                  id="previousExperience"
                  value={formData.previousExperience}
                  onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                  placeholder="Describe your previous roleplay experience"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Availability
                </Label>
                <Textarea
                  id="availability"
                  required
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  placeholder="What are your typical playing hours?"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* IC Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">In Character Information</h3>

              <div className="space-y-2">
                <Label htmlFor="medicalBackground" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Medical Background
                </Label>
                <Textarea
                  id="medicalBackground"
                  required
                  value={formData.medicalBackground}
                  onChange={(e) => handleInputChange('medicalBackground', e.target.value)}
                  placeholder="Describe your character's medical background and training"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specializations" className="text-base">
                  Medical Specializations
                </Label>
                <Textarea
                  id="specializations"
                  value={formData.specializations}
                  onChange={(e) => handleInputChange('specializations', e.target.value)}
                  placeholder="Any specific medical areas your character specializes in"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyScenario" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Emergency Scenario Response
                </Label>
                <Textarea
                  id="emergencyScenario"
                  required
                  value={formData.emergencyScenario}
                  onChange={(e) => handleInputChange('emergencyScenario', e.target.value)}
                  placeholder="How would your character handle a mass casualty incident?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamworkExample" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Teamwork Example
                </Label>
                <Textarea
                  id="teamworkExample"
                  required
                  value={formData.teamworkExample}
                  onChange={(e) => handleInputChange('teamworkExample', e.target.value)}
                  placeholder="Describe a situation where your character had to work as part of a team"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stressManagement" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Stress Management
                </Label>
                <Textarea
                  id="stressManagement"
                  required
                  value={formData.stressManagement}
                  onChange={(e) => handleInputChange('stressManagement', e.target.value)}
                  placeholder="How does your character handle high-stress situations?"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 