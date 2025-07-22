import { differenceInDays, parseISO, format, startOfDay, endOfDay } from 'date-fns';

// Generate Gantt chart data from initiative milestones
export const generateGanttData = (initiative) => {
  if (!initiative) return [];
  
  const milestones = initiative.milestones || [];
  const today = new Date();
  
  // If no milestones, generate mock data
  if (milestones.length === 0) {
    const startDate = new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000));
    const endDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
    
    return [
      {
        id: 1,
        name: 'Discovery & Planning',
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date(startDate.getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        progress: 100,
        color: '#2D606F'
      },
      {
        id: 2,
        name: 'Development Phase 1',
        startDate: new Date(today.getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        endDate: new Date(today.getTime() + (25 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        progress: 45,
        color: '#678C96'
      },
      {
        id: 3,
        name: 'Testing & QA',
        startDate: new Date(today.getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        endDate: new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        progress: 0,
        color: '#96B0B6'
      }
    ];
  }
  
  // Convert milestones to Gantt tasks
  return milestones.map((milestone, index) => ({
    id: milestone.id || index + 1,
    name: milestone.name,
    startDate: milestone.startDate || milestone.date,
    endDate: milestone.endDate || milestone.date,
    progress: milestone.status === 'completed' ? 100 : 0,
    color: getTaskColor(milestone.status, index)
  }));
};

// Get task color based on status and index
export const getTaskColor = (status, index = 0) => {
  const colors = ['#2D606F', '#678C96', '#96B0B6', '#C3D2D6'];
  
  if (status === 'completed') return '#10B981';
  if (status === 'in-progress') return '#F59E0B';
  if (status === 'delayed') return '#EF4444';
  
  return colors[index % colors.length];
};

// Calculate timeline boundaries
export const calculateTimelineBoundaries = (tasks) => {
  if (!tasks || tasks.length === 0) {
    const today = new Date();
    return {
      minDate: startOfDay(new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))),
      maxDate: endOfDay(new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000))),
      totalDays: 120
    };
  }
  
  const allDates = tasks.flatMap(task => {
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate || task.startDate);
    return [start, end];
  });
  
  const minDate = startOfDay(new Date(Math.min(...allDates)));
  const maxDate = endOfDay(new Date(Math.max(...allDates)));
  const totalDays = Math.max(differenceInDays(maxDate, minDate), 1);
  
  return { minDate, maxDate, totalDays };
};

// Calculate task position for Gantt bar
export const calculateTaskPosition = (task, minDate, totalDays) => {
  try {
    const taskStart = parseISO(task.startDate);
    const taskEnd = parseISO(task.endDate || task.startDate);
    const daysFromStart = differenceInDays(taskStart, minDate);
    const taskDuration = Math.max(differenceInDays(taskEnd, taskStart), 1);
    
    const left = Math.max((daysFromStart / totalDays) * 100, 0);
    const width = Math.max((taskDuration / totalDays) * 100, 2);
    
    return { 
      left: `${left}%`, 
      width: `${Math.min(width, 100 - left)}%` 
    };
  } catch (error) {
    console.warn('Error calculating task position:', error);
    return { left: '0%', width: '10%' };
  }
};

// Calculate today indicator position
export const calculateTodayPosition = (minDate, totalDays) => {
  const today = new Date();
  const daysFromStart = differenceInDays(today, minDate);
  const position = (daysFromStart / totalDays) * 100;
  
  return Math.max(Math.min(position, 100), 0);
};

// Format date for Gantt header
export const formatGanttDate = (date, formatType = 'header') => {
  if (formatType === 'header') {
    return format(date, 'MMM yyyy');
  }
  
  if (formatType === 'tooltip') {
    return format(date, 'MMM dd, yyyy');
  }
  
  return format(date, 'MMM dd');
};

// Generate milestone markers for Gantt chart
export const generateMilestoneMarkers = (milestones, minDate, totalDays) => {
  if (!milestones || milestones.length === 0) return [];
  
  return milestones.map(milestone => {
    const milestoneDate = parseISO(milestone.date);
    const daysFromStart = differenceInDays(milestoneDate, minDate);
    const position = (daysFromStart / totalDays) * 100;
    
    return {
      id: milestone.id,
      name: milestone.name,
      position: `${Math.max(Math.min(position, 100), 0)}%`,
      status: milestone.status,
      date: milestone.date
    };
  });
};

// Validate Gantt data
export const validateGanttData = (tasks) => {
  if (!Array.isArray(tasks)) return [];
  
  return tasks.filter(task => {
    if (!task.name || !task.startDate) return false;
    
    try {
      parseISO(task.startDate);
      if (task.endDate) parseISO(task.endDate);
      return true;
    } catch (error) {
      console.warn('Invalid date in Gantt task:', task);
      return false;
    }
  });
};