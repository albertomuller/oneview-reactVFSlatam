const { getConnection, sql } = require('../utils/database');

module.exports = async function (context, req) {
    context.log('Initiatives API - Azure SQL version');
    
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        context.res = { status: 200, headers: corsHeaders };
        return;
    }

    try {
        const pool = await getConnection();

        if (req.method === 'GET') {
            // If no database connection, use mock data
            if (!pool) {
                context.log('Using mock data for initiatives');
                const mockInitiatives = [
                    {
                        id: 'INIT-001',
                        market: 'Brazil',
                        dpm: 'João Silva',
                        businessOwner: 'Maria Santos',
                        po: 'Carlos Oliveira',
                        tdpo: 'Ana Costa',
                        architect: 'Pedro Lima',
                        cybersecurity: 'Lucia Ferreira',
                        strategicIntent: 'Digital Transformation Initiative',
                        keyResults: 'Increase digital adoption by 40%',
                        deadlineStatus: 'On Track',
                        extCost: '$500K',
                        intRes: '15 FTE',
                        lastModified: new Date(),
                        modifiedBy: 'System',
                        fields: {
                            'System.Title': 'Digital Transformation Initiative',
                            'System.WorkItemType': 'Initiative',
                            'System.AreaPath': 'Brazil',
                            'System.State': 'Active',
                            'System.AssignedTo': { displayName: 'João Silva' },
                            'System.CreatedBy': { displayName: 'Maria Santos' }
                        }
                    },
                    {
                        id: 'INIT-002',
                        market: 'Argentina',
                        dpm: 'Diego Rodriguez',
                        businessOwner: 'Carmen Lopez',
                        po: 'Miguel Torres',
                        tdpo: 'Sofia Gonzalez',
                        architect: 'Roberto Vargas',
                        cybersecurity: 'Isabella Martinez',
                        strategicIntent: 'Customer Experience Enhancement',
                        keyResults: 'Improve NPS by 25 points',
                        deadlineStatus: 'At Risk',
                        extCost: '$750K',
                        intRes: '22 FTE',
                        lastModified: new Date(),
                        modifiedBy: 'System',
                        fields: {
                            'System.Title': 'Customer Experience Enhancement',
                            'System.WorkItemType': 'Initiative',
                            'System.AreaPath': 'Argentina',
                            'System.State': 'Active',
                            'System.AssignedTo': { displayName: 'Diego Rodriguez' },
                            'System.CreatedBy': { displayName: 'Carmen Lopez' }
                        }
                    },
                    {
                        id: 'INIT-003',
                        market: 'Chile',
                        dpm: 'Cristian Morales',
                        businessOwner: 'Valentina Ruiz',
                        po: 'Mateo Herrera',
                        tdpo: 'Camila Rojas',
                        architect: 'Felipe Castro',
                        cybersecurity: 'Antonia Silva',
                        strategicIntent: 'Operational Excellence Program',
                        keyResults: 'Reduce operational costs by 30%',
                        deadlineStatus: 'On Track',
                        extCost: '$300K',
                        intRes: '10 FTE',
                        lastModified: new Date(),
                        modifiedBy: 'System',
                        fields: {
                            'System.Title': 'Operational Excellence Program',
                            'System.WorkItemType': 'Initiative',
                            'System.AreaPath': 'Chile',
                            'System.State': 'Active',
                            'System.AssignedTo': { displayName: 'Cristian Morales' },
                            'System.CreatedBy': { displayName: 'Valentina Ruiz' }
                        }
                    }
                ];

                context.res = {
                    status: 200,
                    headers: corsHeaders,
                    body: mockInitiatives
                };
                return;
            }

            // Get all initiatives from database
            const result = await pool.request().query(`
                SELECT 
                    id,
                    market,
                    dpm,
                    businessOwner,
                    po,
                    tdpo,
                    architect,
                    cybersecurity,
                    strategicIntent,
                    keyResults,
                    deadlineStatus,
                    extCost,
                    intRes,
                    lastModified,
                    modifiedBy
                FROM Initiatives
                ORDER BY lastModified DESC
            `);

            const initiatives = {};
            result.recordset.forEach(row => {
                initiatives[row.id] = {
                    id: row.id,
                    market: row.market,
                    dpm: row.dpm,
                    businessOwner: row.businessOwner,
                    po: row.po,
                    tdpo: row.tdpo,
                    architect: row.architect,
                    cybersecurity: row.cybersecurity,
                    strategicIntent: row.strategicIntent,
                    keyResults: row.keyResults,
                    deadlineStatus: row.deadlineStatus,
                    extCost: row.extCost,
                    intRes: row.intRes,
                    lastModified: row.lastModified,
                    modifiedBy: row.modifiedBy,
                    // Mock fields para compatibilidade com o frontend
                    fields: {
                        'System.Title': row.market || 'N/A',
                        'System.WorkItemType': 'Initiative',
                        'System.AreaPath': row.market,
                        'System.State': row.deadlineStatus || 'Active',
                        'System.AssignedTo': { displayName: row.dpm },
                        'System.CreatedBy': { displayName: row.businessOwner }
                    }
                };
            });

            context.res = {
                status: 200,
                headers: corsHeaders,
                body: Object.values(initiatives)
            };
            
        } else if (req.method === 'PUT') {
            // Update initiative
            const initiativeId = req.params?.id || req.body?.id;
            if (!initiativeId) {
                context.res = {
                    status: 400,
                    headers: corsHeaders,
                    body: { error: 'Initiative ID is required' }
                };
                return;
            }

            // If no database connection, return mock response
            if (!pool) {
                context.log('Mock mode: Simulating initiative update');
                const {
                    market, dpm, businessOwner, po, tdpo, architect, cybersecurity,
                    strategicIntent, keyResults, deadlineStatus, extCost, intRes
                } = req.body;

                const updatedInitiative = {
                    id: initiativeId,
                    market, dpm, businessOwner, po, tdpo, architect, cybersecurity,
                    strategicIntent, keyResults, deadlineStatus, extCost, intRes,
                    lastModified: new Date(),
                    modifiedBy: 'System',
                    fields: {
                        'System.Title': strategicIntent || market || 'N/A',
                        'System.WorkItemType': 'Initiative',
                        'System.AreaPath': market,
                        'System.State': deadlineStatus || 'Active',
                        'System.AssignedTo': { displayName: dpm },
                        'System.CreatedBy': { displayName: businessOwner }
                    }
                };

                context.res = {
                    status: 200,
                    headers: corsHeaders,
                    body: updatedInitiative
                };
                return;
            }

            const {
                market, dpm, businessOwner, po, tdpo, architect, cybersecurity,
                strategicIntent, keyResults, deadlineStatus, extCost, intRes
            } = req.body;

            const updateResult = await pool.request()
                .input('id', sql.NVarChar, initiativeId)
                .input('market', sql.NVarChar, market)
                .input('dpm', sql.NVarChar, dpm)
                .input('businessOwner', sql.NVarChar, businessOwner)
                .input('po', sql.NVarChar, po)
                .input('tdpo', sql.NVarChar, tdpo)
                .input('architect', sql.NVarChar, architect)
                .input('cybersecurity', sql.NVarChar, cybersecurity)
                .input('strategicIntent', sql.NVarChar, strategicIntent)
                .input('keyResults', sql.NVarChar, keyResults)
                .input('deadlineStatus', sql.NVarChar, deadlineStatus)
                .input('extCost', sql.NVarChar, extCost)
                .input('intRes', sql.NVarChar, intRes)
                .input('lastModified', sql.DateTime, new Date())
                .input('modifiedBy', sql.NVarChar, 'System') // In real app, use authenticated user
                .query(`
                    UPDATE Initiatives 
                    SET 
                        market = @market,
                        dpm = @dpm,
                        businessOwner = @businessOwner,
                        po = @po,
                        tdpo = @tdpo,
                        architect = @architect,
                        cybersecurity = @cybersecurity,
                        strategicIntent = @strategicIntent,
                        keyResults = @keyResults,
                        deadlineStatus = @deadlineStatus,
                        extCost = @extCost,
                        intRes = @intRes,
                        lastModified = @lastModified,
                        modifiedBy = @modifiedBy
                    WHERE id = @id
                `);

            if (updateResult.rowsAffected[0] === 0) {
                // Initiative doesn't exist, insert it
                const insertResult = await pool.request()
                    .input('id', sql.NVarChar, initiativeId)
                    .input('market', sql.NVarChar, market)
                    .input('dpm', sql.NVarChar, dpm)
                    .input('businessOwner', sql.NVarChar, businessOwner)
                    .input('po', sql.NVarChar, po)
                    .input('tdpo', sql.NVarChar, tdpo)
                    .input('architect', sql.NVarChar, architect)
                    .input('cybersecurity', sql.NVarChar, cybersecurity)
                    .input('strategicIntent', sql.NVarChar, strategicIntent)
                    .input('keyResults', sql.NVarChar, keyResults)
                    .input('deadlineStatus', sql.NVarChar, deadlineStatus)
                    .input('extCost', sql.NVarChar, extCost)
                    .input('intRes', sql.NVarChar, intRes)
                    .input('lastModified', sql.DateTime, new Date())
                    .input('modifiedBy', sql.NVarChar, 'System')
                    .query(`
                        INSERT INTO Initiatives (
                            id, market, dpm, businessOwner, po, tdpo, architect, cybersecurity,
                            strategicIntent, keyResults, deadlineStatus, extCost, intRes,
                            lastModified, modifiedBy
                        ) VALUES (
                            @id, @market, @dpm, @businessOwner, @po, @tdpo, @architect, @cybersecurity,
                            @strategicIntent, @keyResults, @deadlineStatus, @extCost, @intRes,
                            @lastModified, @modifiedBy
                        )
                    `);
            }

            // Return updated initiative
            const updatedInitiative = {
                id: initiativeId,
                market, dpm, businessOwner, po, tdpo, architect, cybersecurity,
                strategicIntent, keyResults, deadlineStatus, extCost, intRes,
                lastModified: new Date(),
                modifiedBy: 'System',
                fields: {
                    'System.Title': market || 'N/A',
                    'System.WorkItemType': 'Initiative',
                    'System.AreaPath': market,
                    'System.State': deadlineStatus || 'Active',
                    'System.AssignedTo': { displayName: dpm },
                    'System.CreatedBy': { displayName: businessOwner }
                }
            };

            context.res = {
                status: 200,
                headers: corsHeaders,
                body: updatedInitiative
            };
            
        } else {
            context.res = {
                status: 405,
                headers: corsHeaders,
                body: { error: 'Method not allowed' }
            };
        }

    } catch (error) {
        context.log.error('Database error:', error);
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: { 
                error: 'Internal server error',
                details: error.message
            }
        };
    }
};
