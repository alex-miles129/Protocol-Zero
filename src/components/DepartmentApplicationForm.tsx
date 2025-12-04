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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationFormConfig } from "@/types/applications"

interface DepartmentApplicationFormProps {
  config: ApplicationFormConfig;
}

export function DepartmentApplicationForm({ config }: DepartmentApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
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
      // Ensure all required fields are present
      const missingFields = config.questions
        .filter(q => q.required && !formData[q.id])
        .map(q => q.label);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Log the data being sent for debugging
      console.log('Submitting application data:', {
        type: config.type,
        formData
      });

      const response = await fetch(`/api/applications/${config.type}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send formData directly, not wrapped
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: `Your ${config.title} has been submitted successfully.`,
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
          Fill Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{config.title}</DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* OOC Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Out of Character Information</h3>
              {config.questions
                .filter(q => q.section === 'ooc')
                .map((question) => (
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
                    ) : question.type === 'boolean' ? (
                      <Select
                        required={question.required}
                        value={formData[question.id]}
                        onValueChange={(value) => handleInputChange(question.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
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
            </div>

            {/* IC Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">In Character Information</h3>
              {config.questions
                .filter(q => q.section === 'ic')
                .map((question) => (
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