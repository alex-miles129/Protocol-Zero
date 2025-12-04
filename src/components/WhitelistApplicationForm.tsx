'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const questions = [
  {
    id: 'discordId',
    label: 'Your Discord User ID',
    type: 'text',
    required: true,
    placeholder: 'Example - (1147884253263167610)',
    defaultValue: '',
  },
  {
    id: 'characterName',
    label: 'What is your Character Name?',
    type: 'text',
    required: true,
    placeholder: 'Enter your character name',
  },
  {
    id: 'experience',
    label: 'Do you have experience with other roleplaying games or servers? Please specify.',
    type: 'textarea',
    required: true,
    placeholder: 'Share your roleplaying experience...',
  },
  {
    id: 'backstory',
    label: 'Provide a brief backstory for your main character',
    type: 'textarea',
    required: true,
    placeholder: 'Write your character backstory...',
  },
  {
    id: 'powergaming',
    label: 'What is powergaming? Provide an example.',
    type: 'textarea',
    required: true,
    placeholder: 'Explain powergaming and give an example...',
  },
  {
    id: 'newLifeRule',
    label: 'Explain the "New Life Rule" and how it affects your character after death.',
    type: 'textarea',
    required: true,
    placeholder: 'Explain the New Life Rule...',
  },
  {
    id: 'rdmVdm',
    label: 'What is RDM and VDM',
    type: 'textarea',
    required: true,
    placeholder: 'Define RDM and VDM...',
  },
  {
    id: 'stayingInCharacter',
    label: 'Explain the concept of "staying in character." Why is it important?',
    type: 'textarea',
    required: true,
    placeholder: 'Explain the importance of staying in character...',
  },
  {
    id: 'ruleBreaking',
    label: 'You witness a player breaking the rules. How do you handle the situation?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe how you would handle rule breaking...',
  },
  {
    id: 'gunpoint',
    label: 'Your character is held at gunpoint during a robbery. How do you respond?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your response to being held at gunpoint...',
  },
  {
    id: 'agreeToRules',
    label: 'Do you agree to follow all server rules and guidelines?',
    type: 'select',
    required: true,
    options: ['Yes', 'No'],
  },
  {
    id: 'hasMicrophone',
    label: 'Do you have a working microphone for in-game communication?',
    type: 'select',
    required: true,
    options: ['Yes', 'No'],
  },
  {
    id: 'memorableExperience',
    label: 'Describe a memorable roleplaying experience you\'ve had.',
    type: 'textarea',
    required: true,
    placeholder: 'Share your memorable roleplaying experience...',
  },
  {
    id: 'streamer',
    label: 'Are you a streamer?',
    type: 'select',
    required: true,
    options: ['Yes', 'No'],
    additionalField: {
      id: 'streamerLink',
      label: 'Streaming Platform Link (Twitch/YouTube)',
      type: 'url',
      placeholder: 'https://twitch.tv/username or https://youtube.com/c/channel',
      showWhen: 'Yes',
      required: true,
      validation: {
        patterns: {
          twitch: '^https?://(www\\.)?(twitch\\.tv)/([a-zA-Z0-9_]{4,25})$',
          youtube: '^https?://(www\\.)?(youtube\\.com)/(channel/|c/|user/|@)?([a-zA-Z0-9_-]+)/?$'
        },
        messages: {
          twitch: 'Must be a valid Twitch channel URL (e.g., https://twitch.tv/username)',
          youtube: 'Must be a valid YouTube channel URL (e.g., https://youtube.com/c/channel)',
          general: 'Please enter a valid Twitch or YouTube channel URL'
        }
      }
    },
  },
];

interface WhitelistApplicationFormProps {
  disabled?: boolean;
}

export function WhitelistApplicationForm({ disabled = false }: WhitelistApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Show loading toast immediately
    const loadingToast = toast({
      title: 'Submitting Application',
      description: 'Please wait while we process your application...',
      duration: 3000,
    });
    
    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'Your whitelist application has been submitted successfully.',
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
        description: 'An unexpected error occurred. Please try again.',
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
    <Dialog open={open} onOpenChange={disabled ? undefined : setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          disabled={disabled}
        >
          {disabled ? 'Already Whitelisted' : 'Fill Form'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Whitelist Application</DialogTitle>
          <DialogDescription>
            {disabled 
              ? "You are already whitelisted. This form is disabled."
              : "Please fill out all required fields marked with an asterisk (*)."
            }
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
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    defaultValue={question.defaultValue}
                    disabled={disabled}
                  />
                ) : question.type === 'select' ? (
                  <div className="space-y-4">
                    <Select
                      required={question.required}
                      onValueChange={(value) => handleInputChange(question.id, value)}
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {question.additionalField && formData[question.id] === question.additionalField.showWhen && (
                      <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Label htmlFor={question.additionalField.id} className="text-sm text-muted-foreground">
                          {question.additionalField.label}
                          {question.additionalField.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Input
                          id={question.additionalField.id}
                          type={question.additionalField.type}
                          required={question.additionalField.required}
                          placeholder={question.additionalField.placeholder}
                          className="bg-background/50"
                          disabled={disabled}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleInputChange(question.additionalField!.id, value);
                            
                            // URL validation
                            const input = e.target as HTMLInputElement;
                            const validation = question.additionalField.validation;
                            
                            if (value) {
                              const twitchRegex = new RegExp(validation.patterns.twitch);
                              const youtubeRegex = new RegExp(validation.patterns.youtube);
                              
                              if (!twitchRegex.test(value) && !youtubeRegex.test(value)) {
                                // Check if it's attempting to be a Twitch URL
                                if (value.includes('twitch.tv')) {
                                  input.setCustomValidity(validation.messages.twitch);
                                }
                                // Check if it's attempting to be a YouTube URL
                                else if (value.includes('youtube.com')) {
                                  input.setCustomValidity(validation.messages.youtube);
                                }
                                // Generic error for other URLs
                                else {
                                  input.setCustomValidity(validation.messages.general);
                                }
                              } else {
                                input.setCustomValidity('');
                              }
                            } else {
                              input.setCustomValidity('');
                            }
                          }}
                        />
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Valid URL formats:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside pl-2">
                            <li>Twitch: https://twitch.tv/username</li>
                            <li>YouTube: https://youtube.com/c/channel</li>
                            <li>YouTube: https://youtube.com/channel/ID</li>
                            <li>YouTube: https://youtube.com/@username</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    id={question.id}
                    type={question.type}
                    required={question.required}
                    placeholder={question.placeholder}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    defaultValue={question.defaultValue}
                    disabled={disabled}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting || disabled}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || disabled}
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