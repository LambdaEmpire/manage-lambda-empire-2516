import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import * as LucideIcons from 'lucide-react';

interface AccomplishmentType {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  icon_color: string;
  category: string;
}

interface MemberAccomplishment {
  id: string;
  awarded_at: string;
  notes: string;
  accomplishment_types: AccomplishmentType;
}

interface MemberAccomplishmentsProps {
  memberId: string;
  showTitle?: boolean;
  compact?: boolean;
}

const MemberAccomplishments: React.FC<MemberAccomplishmentsProps> = ({ 
  memberId, 
  showTitle = true, 
  compact = false 
}) => {
  const [accomplishments, setAccomplishments] = useState<MemberAccomplishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberAccomplishments();
  }, [memberId]);

  const fetchMemberAccomplishments = async () => {
    try {
      const { data, error } = await supabase
        .from('member_accomplishments')
        .select(`
          *,
          accomplishment_types (*)
        `)
        .eq('member_id', memberId)
        .order('awarded_at', { ascending: false });

      if (error) {
        console.error('Error fetching accomplishments:', error);
      } else {
        setAccomplishments(data || []);
      }
    } catch (error) {
      console.error('Error fetching accomplishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: string, color: string, size: number = 24) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Award;
    return <IconComponent size={size} style={{ color }} />;
  };

  const groupedAccomplishments = accomplishments.reduce((acc, accomplishment) => {
    const category = accomplishment.accomplishment_types.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(accomplishment);
    return acc;
  }, {} as Record<string, MemberAccomplishment[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (accomplishments.length === 0) {
    return (
      <Card>
        <CardHeader>
          {showTitle && <CardTitle>Accomplishments</CardTitle>}
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No accomplishments yet</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {showTitle && <h3 className="font-semibold text-lg">Accomplishments</h3>}
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {accomplishments.map((accomplishment) => (
              <Tooltip key={accomplishment.id}>
                <TooltipTrigger>
                  <div className="p-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    {renderIcon(
                      accomplishment.accomplishment_types.icon_name,
                      accomplishment.accomplishment_types.icon_color,
                      20
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-semibold">{accomplishment.accomplishment_types.name}</p>
                    <p className="text-sm text-gray-600">{accomplishment.accomplishment_types.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Awarded {new Date(accomplishment.awarded_at).toLocaleDateString()}
                    </p>
                    {accomplishment.notes && (
                      <p className="text-xs text-gray-600 mt-1 italic">"{accomplishment.notes}"</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        {showTitle && <CardTitle>Accomplishments ({accomplishments.length})</CardTitle>}
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedAccomplishments).map(([category, categoryAccomplishments]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm uppercase tracking-wide text-gray-600">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryAccomplishments.map((accomplishment) => (
                <div
                  key={accomplishment.id}
                  className="p-4 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {renderIcon(
                        accomplishment.accomplishment_types.icon_name,
                        accomplishment.accomplishment_types.icon_color,
                        24
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm leading-tight">
                        {accomplishment.accomplishment_types.name}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {accomplishment.accomplishment_types.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(accomplishment.awarded_at).toLocaleDateString()}
                      </p>
                      {accomplishment.notes && (
                        <p className="text-xs text-gray-600 mt-1 italic">
                          "{accomplishment.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MemberAccomplishments;