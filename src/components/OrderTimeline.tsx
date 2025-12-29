import { Clock, Truck, PackageCheck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface StatusHistory {
  id: string;
  status: string;
  changed_at: string;
}

interface OrderTimelineProps {
  statusHistory: StatusHistory[];
  currentStatus: string;
}

const statusSteps = [
  { key: 'order_placed', label: 'Order Placed', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'dispatched', label: 'Dispatched', icon: PackageCheck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const OrderTimeline = ({ statusHistory, currentStatus }: OrderTimelineProps) => {
  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  const getStatusTimestamp = (status: string) => {
    const historyEntry = statusHistory.find(h => h.status === status);
    return historyEntry ? format(new Date(historyEntry.changed_at), 'MMM dd, yyyy h:mm a') : null;
  };

  return (
    <div className="py-4">
      <h4 className="font-medium text-foreground mb-4">Order Timeline</h4>
      <div className="relative">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const timestamp = getStatusTimestamp(step.key);
          
          return (
            <div key={step.key} className="flex items-start gap-4 relative">
              {/* Vertical line */}
              {index < statusSteps.length - 1 && (
                <div 
                  className={`absolute left-5 top-10 w-0.5 h-12 ${
                    index < currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
              
              {/* Icon circle */}
              <div 
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-background border-muted text-muted-foreground'
                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                {timestamp ? (
                  <p className="text-sm text-muted-foreground">{timestamp}</p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
