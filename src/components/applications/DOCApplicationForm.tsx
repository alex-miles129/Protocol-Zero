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

export function DOCApplicationForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // OOC Information
    discordId: '',
    age: '',
    timezone: '',
    rpExperience: '',
    roleQualification: '',
    
    // IC Information
    characterName: '',
    characterAge: '',
    background: '',
    workReason: '',
    inmateHandling: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications/doc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'doc',
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
          description: 'Your DOC application has been submitted successfully.',
          variant: 'success',
          duration: 5000,
        });
        setOpen(false);
        setFormData({
          discordId: '',
          age: '',
          timezone: '',
          rpExperience: '',
          roleQualification: '',
          characterName: '',
          characterAge: '',
          background: '',
          workReason: '',
          inmateHandling: '',
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
          Apply for DOC Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Department of Corrections Application</DialogTitle>
          <DialogDescription>
            Apply for a role in the Department of Corrections. Please fill out all required fields carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* OOC Section */}
            <div>
              <h3 className="text-lg font-semibold">Out of Character Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="discordId" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Discord Handle
                </Label>
                <Input
                  id="discordId"
                  required
                  value={formData.discordId}
                  onChange={(e) => handleInputChange('discordId', e.target.value)}
                  placeholder="Example - Username#1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Must be 18 or older"
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
                  placeholder="Example - EST, GMT, PST"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rpExperience" className="text-base">
                  <span className="text-red-500 mr-1">*</span>RP Experience
                </Label>
                <Textarea
                  id="rpExperience"
                  required
                  value={formData.rpExperience}
                  onChange={(e) => handleInputChange('rpExperience', e.target.value)}
                  placeholder="Detail your roleplay experience, particularly in correctional or prison-related scenarios. Include servers, roles, and memorable experiences."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleQualification" className="text-base">
                  <span className="text-red-500 mr-1">*</span>What makes you a good fit for the DOC role?
                </Label>
                <Textarea
                  id="roleQualification"
                  required
                  value={formData.roleQualification}
                  onChange={(e) => handleInputChange('roleQualification', e.target.value)}
                  placeholder="Explain why you would be a good fit for the Department of Corrections. What qualities and experience do you bring that would enhance prison roleplay?"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* IC Section */}
            <div>
              <h3 className="text-lg font-semibold">In Character Information</h3>

              <div className="space-y-2">
                <Label htmlFor="characterName" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Character Name
                </Label>
                <Input
                  id="characterName"
                  required
                  value={formData.characterName}
                  onChange={(e) => handleInputChange('characterName', e.target.value)}
                  placeholder="Your character's full legal name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="characterAge" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Age
                </Label>
                <Input
                  id="characterAge"
                  type="number"
                  required
                  value={formData.characterAge}
                  onChange={(e) => handleInputChange('characterAge', e.target.value)}
                  placeholder="Your character's current age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="background" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Background
                </Label>
                <Textarea
                  id="background"
                  required
                  value={formData.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  placeholder="Provide a detailed background story for your character, including their criminal history, conviction details, and life experiences that led them to their current situation."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workReason" className="text-base">
                  <span className="text-red-500 mr-1">*</span>Why do you want to work at the Penitentiary?
                </Label>
                <Textarea
                  id="workReason"
                  required
                  value={formData.workReason}
                  onChange={(e) => handleInputChange('workReason', e.target.value)}
                  placeholder="From your character's perspective, explain their motivation for working at the penitentiary. What are their goals and expectations?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inmateHandling" className="text-base">
                  <span className="text-red-500 mr-1">*</span>How would you handle unruly inmates?
                </Label>
                <Textarea
                  id="inmateHandling"
                  required
                  value={formData.inmateHandling}
                  onChange={(e) => handleInputChange('inmateHandling', e.target.value)}
                  placeholder="Describe your character's approach to handling difficult situations with inmates. Include specific examples of de-escalation techniques and conflict resolution."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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