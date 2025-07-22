import React from 'react';
import { format, parseISO, differenceInDays, startOfMonth, endOfMonth, addMonths } from 'date-fns';

const GanttChart = ({ initiative, hierarchyData = [] }) => {
  // Work item type styles from the original
  const workItemTypeStyles = {
    'Initiative': { icon: 'fa-rocket', color: '#2D606F' },
    'Epic': { icon: 'fa-crown', color: '#E8B778' },
    'Feature': { icon: 'fa-trophy', color: '#B8A5E8' },
    'User Story': { icon: 'fa-book-open', color: '#678C96' },
    'Bug': { icon: 'fa-bug', color: '#EF4444' },
    'Task': { icon: 'fa-check-square', color: '#96B0B6' },
    'Risk': { icon: 'fa-exclamation-triangle', color: '#F59E0B' },
    'Default': { icon: 'fa-question-circle', color: '#4A5E65' }
  };

  // Enhanced mock data with work items hierarchy and milestones
  const generateAdvancedGanttData = (initiative) => {
    const today = new Date();
    const baseDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
    
    return [
      // Initiative level
      {
        id: `${initiative.id}`,
        title: initiative.strategicIntent || initiative.market || 'Digital Initiative',
        type: 'Initiative',
        startDate: new Date(baseDate.getTime() + (5 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (180 * 24 * 60 * 60 * 1000)),
        level: 0,
        progress: 45,
        assignedTo: initiative.dpm || 'Project Manager'
      },
      // Epic level
      {
        id: `${initiative.id}-epic-1`,
        title: 'Discovery & Requirements Analysis',
        type: 'Epic',
        startDate: new Date(baseDate.getTime() + (10 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (40 * 24 * 60 * 60 * 1000)),
        level: 1,
        progress: 85,
        assignedTo: 'Business Analyst'
      },
      {
        id: `${initiative.id}-epic-2`,
        title: 'Architecture & Design',
        type: 'Epic',
        startDate: new Date(baseDate.getTime() + (35 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (70 * 24 * 60 * 60 * 1000)),
        level: 1,
        progress: 60,
        assignedTo: initiative.architect || 'Solution Architect'
      },
      {
        id: `${initiative.id}-epic-3`,
        title: 'Development & Implementation',
        type: 'Epic',
        startDate: new Date(baseDate.getTime() + (65 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (140 * 24 * 60 * 60 * 1000)),
        level: 1,
        progress: 25,
        assignedTo: 'Development Team'
      },
      // Feature level
      {
        id: `${initiative.id}-feature-1`,
        title: 'User Interface Design',
        type: 'Feature',
        startDate: new Date(baseDate.getTime() + (40 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (65 * 24 * 60 * 60 * 1000)),
        level: 2,
        progress: 70,
        assignedTo: 'UX Designer'
      },
      {
        id: `${initiative.id}-feature-2`,
        title: 'Backend API Development',
        type: 'Feature',
        startDate: new Date(baseDate.getTime() + (70 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (110 * 24 * 60 * 60 * 1000)),
        level: 2,
        progress: 30,
        assignedTo: 'Backend Developer'
      },
      {
        id: `${initiative.id}-feature-3`,
        title: 'Frontend Implementation',
        type: 'Feature',
        startDate: new Date(baseDate.getTime() + (90 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (125 * 24 * 60 * 60 * 1000)),
        level: 2,
        progress: 15,
        assignedTo: 'Frontend Developer'
      },
      // User Story level
      {
        id: `${initiative.id}-story-1`,
        title: 'User Authentication',
        type: 'User Story',
        startDate: new Date(baseDate.getTime() + (75 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (90 * 24 * 60 * 60 * 1000)),
        level: 3,
        progress: 80,
        assignedTo: 'Developer'
      },
      {
        id: `${initiative.id}-story-2`,
        title: 'Data Integration',
        type: 'User Story',
        startDate: new Date(baseDate.getTime() + (85 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (105 * 24 * 60 * 60 * 1000)),
        level: 3,
        progress: 40,
        assignedTo: 'Integration Specialist'
      },
      {
        id: `${initiative.id}-story-3`,
        title: 'Security Implementation',
        type: 'User Story',
        startDate: new Date(baseDate.getTime() + (95 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (115 * 24 * 60 * 60 * 1000)),
        level: 3,
        progress: 20,
        assignedTo: initiative.cybersecurity || 'Security Engineer'
      },
      // Task level
      {
        id: `${initiative.id}-task-1`,
        title: 'Database Schema',
        type: 'Task',
        startDate: new Date(baseDate.getTime() + (80 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (90 * 24 * 60 * 60 * 1000)),
        level: 4,
        progress: 90,
        assignedTo: 'Database Administrator'
      },
      {
        id: `${initiative.id}-task-2`,
        title: 'Unit Testing',
        type: 'Task',
        startDate: new Date(baseDate.getTime() + (100 * 24 * 60 * 60 * 1000)),
        targetDate: new Date(baseDate.getTime() + (120 * 24 * 60 * 60 * 1000)),
        level: 4,
        progress: 10,
        assignedTo: 'QA Engineer'
      }
    ];
  };

  // OR25 milestones from the original
  const milestones = [
    { date: new Date('2025-02-03'), title: 'OR25A', status: 'upcoming' },
    { date: new Date('2025-04-07'), title: 'OR25B', status: 'upcoming' },
    { date: new Date('2025-06-16'), title: 'OR25C', status: 'upcoming' },
    { date: new Date('2025-08-22'), title: 'OR25D', status: 'upcoming' },
    { date: new Date('2025-11-03'), title: 'OR25E', status: 'upcoming' }
  ];

  const ganttData = generateAdvancedGanttData(initiative);
  
  // Calculate date range
  const allDates = [
    ...ganttData.flatMap(item => [item.startDate, item.targetDate]),
    ...milestones.map(m => m.date)
  ];
  
  let minDate = new Date(Math.min(...allDates));
  let maxDate = new Date(Math.max(...allDates));
  
  // Extend range for better visualization
  minDate = startOfMonth(new Date(minDate.getTime() - (15 * 24 * 60 * 60 * 1000)));
  maxDate = endOfMonth(addMonths(maxDate, 1));
  
  const totalDays = differenceInDays(maxDate, minDate);

  // Generate month columns
  const generateMonths = () => {
    const months = [];
    let currentDate = new Date(minDate);
    
    while (currentDate <= maxDate) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
      const monthWidth = (daysInMonth / totalDays) * 100;
      
      months.push({
        name: format(currentDate, 'MMM \'yy'),
        width: monthWidth,
        startDate: monthStart
      });
      
      currentDate = addMonths(currentDate, 1);
    }
    
    return months;
  };

  const months = generateMonths();

  // Calculate bar dimensions and position
  const calculateBarDimensions = (item) => {
    const startOffset = Math.max(0, differenceInDays(item.startDate, minDate));
    const duration = Math.max(1, differenceInDays(item.targetDate, item.startDate));
    
    return {
      left: (startOffset / totalDays) * 100,
      width: Math.max(1, Math.min((duration / totalDays) * 100, 100))
    };
  };

  // Get today marker position
  const getTodayPosition = () => {
    const today = new Date();
    if (today >= minDate && today <= maxDate) {
      const offsetDays = differenceInDays(today, minDate);
      return (offsetDays / totalDays) * 100;
    }
    return null;
  };

  const todayPosition = getTodayPosition();

  return (
    <div className="gantt-chart bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="gantt-header p-4 bg-gray-50 border-b">
        <h4 className="font-semibold text-gray-800 text-base mb-2 flex items-center gap-2">
          <i className="fas fa-chart-gantt text-primary"></i>
          PROJECT TIMELINE
        </h4>
        <p className="text-sm text-gray-600">
          Strategic initiative execution timeline with work items and milestones
        </p>
      </div>

      <div className="gantt-content">
        {/* Month Headers */}
        <div className="gantt-timeline-header flex bg-gray-100 border-b">
          <div className="gantt-labels-column w-80 p-3 font-semibold text-xs text-gray-600 border-r">
            WORK ITEMS
          </div>
          <div className="gantt-timeline-columns flex flex-1 min-w-0">
            {months.map((month, index) => (
              <div
                key={index}
                className="text-center font-medium border-r border-gray-300 py-2 px-1 text-xs bg-gray-100 min-w-0"
                style={{ width: `${month.width}%` }}
              >
                {month.name}
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Rows */}
        <div className="gantt-rows relative">
          {ganttData.map((item, index) => {
            const dimensions = calculateBarDimensions(item);
            const style = workItemTypeStyles[item.type] || workItemTypeStyles.Default;
            const indentLevel = item.level * 16;
            
            return (
              <div
                key={item.id}
                className="gantt-row flex border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                style={{ height: '2.5rem' }}
              >
                {/* Work Item Label */}
                <div
                  className="gantt-labels-column w-80 p-3 border-r border-gray-200 flex items-center min-w-0"
                  style={{ paddingLeft: `${12 + indentLevel}px` }}
                >
                  <i
                    className={`fas ${style.icon} mr-2 flex-shrink-0`}
                    style={{ color: style.color, fontSize: '0.75rem' }}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-800 truncate" title={item.title}>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.assignedTo} • {item.progress}%
                    </div>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="gantt-timeline-area flex-1 relative min-w-0" style={{ height: '2.5rem' }}>
                  <div
                    className="gantt-bar absolute top-1/2 transform -translate-y-1/2 rounded cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-150"
                    style={{
                      left: `${dimensions.left}%`,
                      width: `${dimensions.width}%`,
                      backgroundColor: style.color,
                      height: '1.25rem',
                      zIndex: 10
                    }}
                    title={`${item.title}\n${format(item.startDate, 'MMM dd')} - ${format(item.targetDate, 'MMM dd')}\nProgress: ${item.progress}%\nAssigned: ${item.assignedTo}`}
                  >
                    <div className="h-full flex items-center justify-between px-2 text-white text-xs font-medium relative overflow-hidden">
                      <span className="truncate">{item.progress}%</span>
                      <i className="fas fa-external-link-alt opacity-70" style={{ fontSize: '0.6rem' }}></i>
                      
                      {/* Progress fill */}
                      <div
                        className="absolute inset-0 bg-black bg-opacity-20 rounded"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Today Marker */}
          {todayPosition !== null && (
            <>
              <div
                className="absolute top-0 bottom-0 bg-primary opacity-80 pointer-events-none"
                style={{
                  left: `calc(20rem + ${todayPosition}%)`,
                  width: '2px',
                  zIndex: 20
                }}
              ></div>
              <div
                className="absolute bottom-2 bg-primary text-white px-2 py-1 text-xs font-semibold rounded shadow-lg pointer-events-none transform -translate-x-1/2"
                style={{
                  left: `calc(20rem + ${todayPosition}%)`,
                  zIndex: 25
                }}
              >
                Today
              </div>
            </>
          )}

          {/* Milestones */}
          {milestones.map((milestone, index) => {
            const milestoneDate = milestone.date;
            if (milestoneDate >= minDate && milestoneDate <= maxDate) {
              const offsetDays = differenceInDays(milestoneDate, minDate);
              const leftPosition = (offsetDays / totalDays) * 100;
              
              return (
                <div key={index}>
                  {/* Milestone line */}
                  <div
                    className="absolute top-0 bottom-0 bg-orange-500 opacity-60 pointer-events-none"
                    style={{
                      left: `calc(20rem + ${leftPosition}%)`,
                      width: '2px',
                      zIndex: 15
                    }}
                  ></div>
                  {/* Milestone label */}
                  <div
                    className="absolute top-2 bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded shadow pointer-events-none transform -translate-x-1/2"
                    style={{
                      left: `calc(20rem + ${leftPosition}%)`,
                      zIndex: 20
                    }}
                  >
                    {milestone.title}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="gantt-footer p-4 bg-gray-50 border-t">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>OR25 Milestones</span>
          </div>
          {Object.entries(workItemTypeStyles).slice(0, 4).map(([type, style]) => (
            <div key={type} className="flex items-center gap-1">
              <i className={`fas ${style.icon}`} style={{ color: style.color, fontSize: '0.75rem' }}></i>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;