import { Badge, Card, Dialog } from '@/app/components/ui';
import {
  AgeCondition,
  BlacklistCondition,
  BuyCondition,
  SellCondition,
  SellStrategy,
  UserStrategy,
} from '@/types';
import {
  AlertCircle,
  BarChart2,
  Clock,
  DollarSign,
  Droplet,
  Pause,
  PenSquare,
  Play,
  ShoppingCart,
} from 'lucide-react';
import React, { useState } from 'react';

interface StrategyCardProps {
  strategy: UserStrategy & { pnlUSD: number; pnlTON: number };
  onPause: (id: number, isActive: boolean) => void;
  onRename: (id: number, newName: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'tokenName':
      return <ShoppingCart className='h-4 w-4 mr-1' />;
    case 'marketCap':
      return <BarChart2 className='h-4 w-4 mr-1' />;
    case 'blacklist':
      return <AlertCircle className='h-4 w-4 mr-1' />;
    case 'price':
      return <DollarSign className='h-4 w-4 mr-1' />;
    case 'age':
      return <Clock className='h-4 w-4 mr-1' />;
    case 'liquidity':
      return <Droplet className='h-4 w-4 mr-1' />;
    default:
      return null;
  }
};

const getOperatorSymbol = (operator: string): string => {
  switch (operator) {
    case 'greaterThan':
      return '>';
    case 'lessThan':
      return '<';
    case 'between':
      return '><';
    case 'equal':
      return '=';
    case 'contains':
      return '∈';
    case 'increasedBy':
      return '↑';
    case 'decreasedBy':
      return '↓';
    default:
      return operator;
  }
};

const getConditionName = (type: string): string => {
  switch (type) {
    case 'tokenName':
      return 'Token contains';
    case 'marketCap':
      return 'Market Cap';
    case 'blacklist':
      return 'Prevention: ';
    case 'price':
      return 'Price';
    case 'age':
      return 'Age';
    case 'liquidity':
      return 'Liquidity';
    default:
      return type;
  }
};

const isAgeCondition = (condition: BuyCondition | SellCondition): condition is AgeCondition => {
  return condition.type === 'age';
};

const isBlacklistCondition = (
  condition: BuyCondition | SellCondition,
): condition is BlacklistCondition => {
  return condition.type === 'blacklist';
};

const ConditionBadge: React.FC<{ condition: BuyCondition | SellCondition }> = ({ condition }) => {
  const renderValue = () => {
    if (isAgeCondition(condition)) {
      return `${condition.days} day${condition.days !== 1 ? 's' : ''}`;
    }
    if (isBlacklistCondition(condition)) {
      return `${condition.checkDollarSign ? '$ ' : ''}${
        condition.checkBlacklist ? 'scam names' : ''
      }`;
    }
    if ('value' in condition) {
      const addDollarSign =
        condition.type === 'marketCap' ||
        condition.type === 'liquidity' ||
        condition.type === 'price';
      if (Array.isArray(condition.value)) {
        return `${addDollarSign ? '$' : ''}${condition.value[0]} - ${addDollarSign ? '$' : ''}${
          condition.value[1]
        }`;
      }
      return `${addDollarSign ? '$' : ''}${condition.value.toString()}`;
    }
    return '';
  };

  const operator = 'operator' in condition ? getOperatorSymbol(condition.operator) : '';
  const conditionName = getConditionName(condition.type);

  let content;
  if (condition.type === 'tokenName') {
    content = `${conditionName} "${renderValue()}"`;
  } else if (condition.type === 'price' && (operator === '↑' || operator === '↓')) {
    content = `${conditionName} ${operator} ${renderValue()}%`;
  } else {
    content = `${conditionName} ${operator} ${renderValue()}`;
  }

  return (
    <Badge variant='gray' rounded='full' className='mr-2 mb-2'>
      {getIcon(condition.type)}
      {content}
    </Badge>
  );
};

const BuyConditions: React.FC<{
  buy?: UserStrategy['strategyLogic']['buy'];
}> = ({ buy }) => {
  if (!buy) return null;

  return (
    <div className='mt-4'>
      <h3 className='text-base font-medium text-text-title'>Buy Conditions</h3>
      <div className='mt-2 flex flex-wrap w-full'>
        {buy.conditions.map((condition, index) => (
          <ConditionBadge key={index} condition={condition} />
        ))}
      </div>
      <div className='mt-2'>
        <Badge variant='green' rounded='full'>
          <DollarSign className='h-4 w-4 mr-1' />
          {`Buy ${buy.action.amount} TON`}
        </Badge>
      </div>
    </div>
  );
};

const SellConditions: React.FC<{ strategies?: SellStrategy[] }> = ({ strategies }) => {
  if (!strategies) return null;

  return (
    <div className='mt-4'>
      <h3 className='text-base font-medium text-text-title'>Sell Conditions</h3>
      <div className='mt-2'>
        {strategies.map((strategy, index) => (
          <div key={index} className='flex items-start mb-2'>
            <div className='flex-grow'>
              <ConditionBadge condition={strategy.condition} />
            </div>
            <Badge variant='red' rounded='full' className='ml-2'>
              <DollarSign className='h-4 w-4 mr-1' />
              {`Sell ${strategy.action.amount}% of holdings`}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pnl: React.FC<{ pnlUSD: number; pnlTON: number }> = ({ pnlUSD, pnlTON }) => {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className='my-4'>
      <h3 className='text-base font-medium text-text-title'>PNL (Profit and Loss)</h3>
      <div className='mt-2 space-x-2'>
        <Badge variant={pnlUSD >= 0 ? 'green' : 'red'} rounded='full'>
          {formatCurrency(Math.abs(pnlUSD), 'USD')}
        </Badge>
        <Badge variant={pnlTON >= 0 ? 'green' : 'red'} rounded='full'>
          {Math.abs(pnlTON).toFixed(2)} TON
        </Badge>
      </div>
    </div>
  );
};

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onPause, onRename }) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const handleRenameClick = () => {
    setIsRenameDialogOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    onRename(strategy.id, newName);
    setIsRenameDialogOpen(false);
  };

  const handleToggleActive = () => {
    onPause(strategy.id, !strategy.isActive);
  };

  const menuItems = [
    {
      label: strategy.isActive ? 'Pause' : 'Unpause',
      icon: strategy.isActive ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />,
      onClick: handleToggleActive,
    },
    {
      label: 'Rename',
      icon: <PenSquare className='h-5 w-5' />,
      onClick: handleRenameClick,
    },
  ];

  return (
    <>
      <Card>
        <Card.Header
          title={strategy.name}
          action={
            <Badge variant={strategy.isActive ? 'green' : 'red'} rounded='md'>
              {strategy.isActive ? 'Active' : 'Inactive'}
            </Badge>
          }
          menu={{ items: menuItems }}
        />
        <Card.Content>
          <BuyConditions buy={strategy.strategyLogic.buy} />
          <SellConditions strategies={strategy.strategyLogic.sell} />
          <Pnl pnlUSD={strategy.pnlUSD} pnlTON={strategy.pnlTON} />
        </Card.Content>
      </Card>

      <Dialog
        open={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        title='Rename Strategy'
        description='Enter a new name for your strategy'
        input={{
          label: 'New Strategy Name',
          initialValue: strategy.name,
        }}
        primaryAction={{
          label: 'Rename',
          onClick: handleRenameConfirm,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setIsRenameDialogOpen(false),
        }}
      />
    </>
  );
};

export default StrategyCard;
