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

const questions = [
  {
    id: 'discordId',
    label: 'Discord Name',
    type: 'text',
    required: true,
    placeholder: 'Your Discord Name (e.g., username#1234)',
  },
  {
    id: 'characterName',
    label: 'Character Name',
    type: 'text',
    required: true,
    placeholder: 'Your character\'s full name',
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    required: true,
    placeholder: 'Must be 18 or older',
  },
  {
    id: 'timezone',
    label: 'Timezone',
    type: 'text',
    required: true,
    placeholder: 'Your timezone (e.g., EST, GMT+1)',
  },
  {
    id: 'previousExperience',
    label: 'Previous RP Experience',
    type: 'textarea',
    required: false,
    placeholder: 'Describe your previous roleplay experience',
  },
  {
    id: 'joinReason',
    label: 'Why do you want to join DOJ?',
    type: 'textarea',
    required: true,
    placeholder: 'Why do you want to join the Department of Justice?',
  },
  {
    id: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'text',
    required: true,
    placeholder: 'MM/DD/YYYY',
  },
  {
    id: 'legalBackground',
    label: 'Legal Background',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your character\'s legal background',
  },
  {
    id: 'specialization',
    label: 'Legal Specialization',
    type: 'textarea',
    required: true,
    placeholder: 'What area of law does your character specialize in?',
  },
  {
    id: 'caseStudy',
    label: 'Case Study Analysis',
    type: 'textarea',
    required: true,
    placeholder: 'Analyze a hypothetical criminal case',
  },
  {
    id: 'ethicsScenario',
    label: 'Ethics Scenario',
    type: 'textarea',
    required: true,
    placeholder: 'How would you handle an ethical dilemma?',
  },
  {
    id: 'prosecutionStrategy',
    label: 'Prosecution Strategy',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your approach to prosecution',
  },
  {
    id: 'defenseStrategy',
    label: 'Defense Strategy',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your approach to defense',
  },
  {
    id: 'judicialPhilosophy',
    label: 'Judicial Philosophy',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your judicial philosophy',
  },
  {
    id: 'legalWritingSample',
    label: 'Legal Writing Sample',
    type: 'textarea',
    required: true,
    placeholder: 'Provide a sample legal document',
  },
  {
    id: 'legalEducation',
    label: 'Legal Education',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your character\'s legal education',
  },
  {
    id: 'caseHistory',
    label: 'Case History',
    type: 'textarea',
    required: false,
    placeholder: 'List any notable cases your character has been involved in',
  },
];

export function DOJApplicationForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Show loading toast immediately
    toast({
      title: 'Submitting Application',
      description: 'Please wait while we process your application...',
      duration: 3000,
    });
    
    try {
      // Ensure all required fields are present
      const missingFields = questions
        .filter(q => q.required && !formData[q.id])
        .map(q => q.label);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await fetch('/api/applications/doj/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'Your Department of Justice application has been submitted successfully.',
          variant: 'success',
          duration: 5000,
        });
        setOpen(false);
        // Reset form data
        setFormData({});
      } else {
        toast({
          title: 'Submission Failed',
          description: data.error || 'Failed to submit application. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          Apply for Department of Justice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Department of Justice Application</DialogTitle>
          <DialogDescription>
            Please fill out all required fields marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label htmlFor={question.id} className="text-base">
                  {question.required && <span className="text-red-500 mr-1">*</span>}
                  {question.label}
                </Label>
                {question.type === 'textarea' ? (
                  <Textarea
                    id={question.id}
                    required={question.required}
                    placeholder={question.placeholder}
                    className="min-h-[100px]"
                    value={formData[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                ) : (
                  <Input
                    id={question.id}
                    type={question.type}
                    required={question.required}
                    placeholder={question.placeholder}
                    value={formData[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                )}
              </div>
            ))}
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