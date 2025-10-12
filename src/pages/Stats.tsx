import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsDashboard } from '@/components/StatsDashboard';
import { RiskDistributionChart } from '@/components/RiskDistributionChart';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const Stats = () => {
  const { stats, history } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <BreadcrumbNav currentView="stats" />
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Back to Detector
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
            <StatsDashboard stats={stats} />
            <RiskDistributionChart history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
