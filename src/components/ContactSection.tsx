'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { submitContactForm } from '@/app/actions/contactActions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Icons } from '@/config/siteConfig';

const contactFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Default values for the form
const defaultValues: Partial<ContactFormValues> = {
  username: '',
  message: '',
};

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: ContactFormValues) {
    console.log('Form submitted with data:', data);
    setIsSubmitting(true);
    
    // Show immediate loading toast
    toast({
      title: 'Sending Message...',
      description: 'Please wait while we process your request.',
      duration: 2000,
    });

    try {
      const result = await submitContactForm(data);
      console.log('Received response from server:', result);
      
      if (result.success) {
        console.log('Showing success toast');
        // Force remove any existing toasts
        document.querySelectorAll('[role="status"]').forEach(el => el.remove());
        
        // Show success toast with longer duration
        toast({
          variant: "success",
          title: "Message Sent!",
          description: result.message || 'We have received your message and will get back to you soon.',
          duration: 5000,
        });
        form.reset();
      } else {
        console.log('Showing error toast');
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Could not send your message. Please try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      console.log('Showing error toast');
      toast({
        variant: "destructive",
        title: "Error",
        description: 'An unexpected error occurred. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-12 lg:gap-24">
          {/* Left Side: Titles */}
          <div className="flex items-start gap-6 lg:gap-8 md:w-1/3 lg:w-1/4">
            <div className="hidden md:flex flex-col items-center self-start pr-8 lg:pr-12">
              <div 
                className="[writing-mode:vertical-lr] text-xs font-semibold text-primary space-y-1 tracking-[0.2em] uppercase"
              >
                <span>C</span>
                <span>O</span>
                <span>N</span>
                <span>T</span>
                <span>A</span>
                <span>C</span>
                <span>T</span>
                <div className="h-2 my-1"></div> {/* Spacer */}
                <span>U</span>
                <span>S</span>
              </div>
              <div className="mt-4 h-20 w-px bg-border/60"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-destructive tracking-tight uppercase">
              CONTACT US
            </h2>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1">
            <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              className="min-h-[150px] bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </Form>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
}
