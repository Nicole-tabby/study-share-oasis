
import React from 'react';
import { Card } from '@/components/ui/card';
import { Phone, Mail } from 'lucide-react';

interface SupportContact {
  name: string;
  phone: string;
}

const SupportCenter = () => {
  const supportContacts: SupportContact[] = [
    { name: "Nicole Tabby", phone: "+918792721830" },
    { name: "Aravind Yavad", phone: "+918197910698" },
    { name: "Vishwas Gowda", phone: "+918073785737" }
  ];

  return (
    <Card className="p-5 dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Support Center</h3>
      
      <div className="space-y-4">
        {supportContacts.map((contact, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-studyhub-100 dark:bg-studyhub-900 flex items-center justify-center">
              <Phone className="h-4 w-4 text-studyhub-600 dark:text-studyhub-300" />
            </div>
            <div>
              <p className="font-medium text-sm dark:text-gray-200">{contact.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{contact.phone}</p>
            </div>
          </div>
        ))}
        
        <div className="flex items-center space-x-3 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="h-8 w-8 rounded-full bg-studyhub-100 dark:bg-studyhub-900 flex items-center justify-center">
            <Mail className="h-4 w-4 text-studyhub-600 dark:text-studyhub-300" />
          </div>
          <div>
            <p className="font-medium text-sm dark:text-gray-200">Email Support</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">support@studyhub.com</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SupportCenter;
