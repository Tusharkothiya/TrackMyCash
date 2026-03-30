"use client";

import { cn } from "@/lib/utils/helper";

const InsightCard = ({
  icon: Icon,
  title,
  description,
  bgIcon: BgIcon,
  iconColor = "text-primary",
}: {
  icon: any;
  title: string;
  description: string;
  bgIcon: any;
  iconColor?: string;
}) => {
  return (
    <div className="min-w-75 flex-1 bg-surface-container rounded-xl p-6 relative overflow-hidden group">
      <div className="relative z-10">
        <Icon className={cn("mb-4", iconColor)} size={40} />
        <h4 className="text-lg font-bold text-on-surface mb-2">{title}</h4>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BgIcon size={140} />
      </div>
    </div>
  );
};

export default InsightCard;
