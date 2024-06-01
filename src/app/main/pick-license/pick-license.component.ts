import { Component } from '@angular/core';

@Component({
  selector: 'app-pick-license',
  templateUrl: './pick-license.component.html',
  styleUrl: './pick-license.component.scss'
})
export class PickLicenseComponent {

  billingCycle: 'monthly' | 'yearly' = 'monthly';
  plans: Plan[] = [
    {
      name: 'Basic',
      description: 'Ideal for individuals and small businesses',
      price: 9,
      features: [
        'Arcu vitae elementum',
        'Dui faucibus in ornare',
        'Morbi tincidunt augue'
      ]
    },
    {
      name: 'Standard',
      description: 'Great for growing businesses',
      price: 29,
      features: [
        'Arcu vitae elementum',
        'Dui faucibus in ornare',
        'Morbi tincidunt augue',
        'Duis ultricies lacus sed'
      ]
    },
    {
      name: 'Premium',
      description: 'Perfect for large organizations',
      price: 49,
      features: [
        'Arcu vitae elementum',
        'Dui faucibus in ornare',
        'Morbi tincidunt augue',
        'Duis ultricies lacus sed',
        'Imperdiet proin',
        'Nisi scelerisque'
      ]
    }
  ];

  // Toggle between Monthly and Yearly billing cycle
  toggleBillingCycle(cycle: 'monthly' | 'yearly') {
    this.billingCycle = cycle;
  }

  // Get formatted price based on the billing cycle
  getFormattedPrice(price: number): string {
    if (this.billingCycle === 'monthly') {
      return `$${price}`;
    } else {
      return `$${price * 12}`; // Yearly price
    }
  }

  // Get yearly cost
  getYearlyCost(price: number): string {
    return `$${price * 12}`; // Assuming 12 months in a year
  }

}


interface Plan {
  name: string;
  description: string;
  price: number;
  features: string[];
}