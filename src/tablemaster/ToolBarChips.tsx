import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { SvgIcon } from '@mui/material';
import { ReactComponent as Avg } from '../assets/icons/avg.svg';
import { ReactComponent as AvgCalMonth } from '../assets/icons/avg_cal_month.svg';
import { ReactComponent as AvgCalDay } from '../assets/icons/avg_cal_day.svg';
import { ReactComponent as Total } from '../assets/icons/total.svg';
import { formatNumberToEuro, daysBetweenTransactions, monthBetweenTransactions } from '../../src/utils/utils';
import 'dayjs/locale/de';

interface TableData {
  [key: string]: any;
}

interface ChipData {
  dateKey: string;
  amountKey: string;
}

interface ToolBarChipsProps {
  table: any;
  tableData: TableData[];
  totalChip?: ChipData;
  avgChip?: ChipData;
  avgPerDayChip?: ChipData;
  avgPerMonthChip?: ChipData;
}

const ToolBarChips: React.FC<ToolBarChipsProps> = ({ table, tableData, totalChip, avgChip, avgPerDayChip, avgPerMonthChip }) => {
  const [currentRows, setCurrentRows] = useState<TableData[]>([]);
  const [total, setTotal] = useState<number | undefined>();
  const [avg, setAvg] = useState<number | undefined>();
  const [avgPerDay, setAvgPerDay] = useState<number | undefined>();
  const [avgPerDayTooltip, setAvgPerDayTooltip] = useState<string | undefined>();
  const [avgPerMonth, setAvgPerMonth] = useState<number | undefined>();
  const [avgPerMonthTooltip, setAvgPerMonthTooltip] = useState<string | undefined>();

  useEffect(() => {
    let oldestDate = '';
    let youngestDate = '';
    let days = 0;
    let oldestMonth = '';
    let youngestMonth = '';
    let month = 0;

    if (tableData && tableData.length > 0) {
      const daysBetweenDates = daysBetweenTransactions(tableData, avgPerDayChip?.dateKey || '', true);
      if (
        daysBetweenDates &&
        daysBetweenDates.oldestDate &&
        daysBetweenDates.youngestDate &&
        typeof daysBetweenDates.days !== 'undefined'
      ) {
        oldestDate = daysBetweenDates.oldestDate.format('DD.MM.YY');
        youngestDate = daysBetweenDates.youngestDate.format('DD.MM.YY');
        days = daysBetweenDates.days + 1;
      }

      const monthBetweenDates = monthBetweenTransactions(tableData, avgPerMonthChip?.dateKey || '');
      if (
        monthBetweenDates &&
        monthBetweenDates.oldestDate &&
        monthBetweenDates.youngestDate &&
        typeof monthBetweenDates.month !== 'undefined'
      ) {
        oldestMonth = monthBetweenDates.oldestDate.locale('de').format('MMM YY');
        youngestMonth = monthBetweenDates.youngestDate.locale('de').format('MMM YY');
        month = monthBetweenDates.month + 1;
      }
    }
    const rowsByIds: unknown[] = Object.values(table.getRowModel().rowsById);
    if (rowsByIds) {
      const rows = rowsByIds.map((item: any) => item.original);
      setCurrentRows(rows);

      if (totalChip) {
        const totalAmount = rows.reduce((acc, item) => acc + item[totalChip.amountKey], 0);
        setTotal(totalAmount);
      }

      if (avgChip) {
        const totalAmount = rows.reduce((acc, item) => acc + item[avgChip.amountKey], 0);
        setTotal(totalAmount);
        setAvg(rows.length > 0 ? totalAmount / rows.length : 0);
      }

      if (avgPerDayChip && days > 0) {
        const totalAmount = rows.reduce((acc, item) => acc + item[avgPerDayChip.amountKey], 0);
        setTotal(totalAmount);
        setAvgPerDay(totalAmount / days);
        setAvgPerDayTooltip(`pro Tag (${oldestDate} bis ${youngestDate} | ${days} ${days === 1 ? ' Tag)' : ' Tage)'}}`);
      }

      if (avgPerMonthChip && month > 0) {
        const totalAmount = rows.reduce((acc, item) => acc + item[avgPerMonthChip.amountKey], 0);
        setTotal(totalAmount);
        setAvgPerMonth(totalAmount / month);
        setAvgPerMonthTooltip(`pro Monat (${oldestMonth} bis ${youngestMonth} | ${month} ${month === 1 ? ' Monat)' : ' Monate)'}}`);
      }
    }
  }, [table.getRowModel().rowsById, tableData]);

  return (
    <Box sx={{ display: 'flex', gap: '0.1rem', p: '4px' }}>
      {currentRows.length > 0 && (
        <Chip
          sx={{ margin: '0px 15px 0px 0px' }}
          avatar={<TagIcon fontSize="small" />}
          label={<Typography style={styles.countChip}>{currentRows.length}</Typography>}
          size="small"
          variant="outlined"
        />
      )}
      {totalChip && total !== undefined && (
        <Chip
          sx={{ margin: '0px 15px 0px 0px' }}
          avatar={<SvgIcon component={Total} inheritViewBox />}
          label={<Typography style={styles.countChip}>{formatNumberToEuro(total)}</Typography>}
          size="small"
          variant="outlined"
        />
      )}
      {avgChip && avg !== undefined && (
        <Tooltip title="pro Transaktion">
          <Chip
            sx={{ margin: '0px 15px 0px 0px' }}
            avatar={<SvgIcon component={Avg} inheritViewBox />}
            label={<Typography style={styles.countChip}>{formatNumberToEuro(avg)}</Typography>}
            size="small"
            variant="outlined"
          />
        </Tooltip>
      )}
      {avgPerDayChip && avgPerDay !== undefined && (
        <Tooltip title={avgPerDayTooltip || ''}>
          <Chip
            sx={{ margin: '0px 15px 0px 0px' }}
            avatar={<SvgIcon component={AvgCalDay} inheritViewBox />}
            label={<Typography style={styles.countChip}>{formatNumberToEuro(avgPerDay)}</Typography>}
            size="small"
            variant="outlined"
          />
        </Tooltip>
      )}
      {avgPerMonthChip && avgPerMonth !== undefined && (
        <Tooltip title={avgPerMonthTooltip || ''}>
          <Chip
            sx={{ margin: '0px 15px 0px 0px' }}
            avatar={<SvgIcon component={AvgCalMonth} inheritViewBox />}
            label={<Typography style={styles.countChip}>{formatNumberToEuro(avgPerMonth)}</Typography>}
            size="small"
            variant="outlined"
          />
        </Tooltip>
      )}
    </Box>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  countChip: {
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '0.8125rem',
  },
};

export default ToolBarChips;
