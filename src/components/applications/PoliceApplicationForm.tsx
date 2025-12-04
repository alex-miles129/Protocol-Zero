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

export function PoliceApplicationForm() {
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
    whyPolice: '',
    availability: '',
    
    // IC Information
    lawEnforcementBackground: '',
    physicalFitness: '',
    conflictResolution: '',
    communityEngagement: '',
    tacticalScenario: '',
    ethicalDilemma: '',
    partnershipApproach: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications/police/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'police',
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
          description: 'Your Police Department application has been submitted successfully.',
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
          whyPolice: '',
          availability: '',
          lawEnforcementBackground: '',
          physicalFitness: '',
          conflictResolution: '',
          communityEngagement: '',
          tacticalScenario: '',
          ethicalDilemma: '',
          partnershipApproach: '',
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
          Apply for Police Department
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Police Department Application</DialogTitle>
          <DialogDescription>
            Apply to join our Police Department. Please fill out all required fields carefully.
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
                <Label htmlFor="whyPolice" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Why Police Department?
                </Label>
                <Textarea
                  id="whyPolice"
                  required
                  value={formData.whyPolice}
                  onChange={(e) => handleInputChange('whyPolice', e.target.value)}
                  placeholder="Why do you want to join the Police Department?"
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
                <Label htmlFor="lawEnforcementBackground" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Law Enforcement Background
                </Label>
                <Textarea
                  id="lawEnforcementBackground"
                  required
                  value={formData.lawEnforcementBackground}
                  onChange={(e) => handleInputChange('lawEnforcementBackground', e.target.value)}
                  placeholder="Describe your character's background in law enforcement or relevant experience"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="physicalFitness" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Physical Fitness
                </Label>
                <Textarea
                  id="physicalFitness"
                  required
                  value={formData.physicalFitness}
                  onChange={(e) => handleInputChange('physicalFitness', e.target.value)}
                  placeholder="Describe your character's physical fitness and ability to perform police duties"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conflictResolution" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Conflict Resolution
                </Label>
                <Textarea
                  id="conflictResolution"
                  required
                  value={formData.conflictResolution}
                  onChange={(e) => handleInputChange('conflictResolution', e.target.value)}
                  placeholder="How would your character handle a hostile situation?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communityEngagement" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Community Engagement
                </Label>
                <Textarea
                  id="communityEngagement"
                  required
                  value={formData.communityEngagement}
                  onChange={(e) => handleInputChange('communityEngagement', e.target.value)}
                  placeholder="How would your character engage with the community?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tacticalScenario" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Tactical Scenario
                </Label>
                <Textarea
                  id="tacticalScenario"
                  required
                  value={formData.tacticalScenario}
                  onChange={(e) => handleInputChange('tacticalScenario', e.target.value)}
                  placeholder="Describe how you would handle an active shooter situation"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ethicalDilemma" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Ethical Dilemma
                </Label>
                <Textarea
                  id="ethicalDilemma"
                  required
                  value={formData.ethicalDilemma}
                  onChange={(e) => handleInputChange('ethicalDilemma', e.target.value)}
                  placeholder="How would you handle a situation where a fellow officer breaks protocol?"
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