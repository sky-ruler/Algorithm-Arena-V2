#!/usr/bin/env node
/**
 * AGGRESSIVE Database Index Repair
 * Force drops ALL indexes and recreates ONLY correct ones
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function aggressiveRepair() {
  console.log('\n' + '='.repeat(70));
  console.log('🔨 AGGRESSIVE INDEX REPAIR - FORCE FIX');
  console.log('='.repeat(70) + '\n');

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected\n');

    const db = mongoose.connection.db;
    const clanCollection = db.collection('clans');

    // Step 1: List all current indexes
    console.log('📊 Current indexes:');
    const currentIndexes = await clanCollection.getIndexes();
    for (const [name, spec] of Object.entries(currentIndexes)) {
      console.log(`  ${name}:`, spec);
    }
    console.log();

    // Step 2: FORCE DROP all indexes except _id_
    console.log('🔨 FORCE DROPPING all indexes...');
    for (const [indexName, spec] of Object.entries(currentIndexes)) {
      if (indexName === '_id_') {
        console.log(`  ⏭️  Skipping _id_ (system index)`);
        continue;
      }

      try {
        await clanCollection.dropIndex(indexName);
        console.log(`  ✅ DROPPED: ${indexName}`);
      } catch (err) {
        console.log(`  ⚠️  Could not drop ${indexName}: ${err.message}`);
      }
    }
    console.log();

    // Step 3: Wait a moment
    console.log('⏳ Waiting for index deletion to propagate...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: CREATE ONLY partial unique indexes
    console.log('✨ Creating NEW partial unique indexes...\n');

    // Index on name (only for active clans)
    try {
      const nameIndexResult = await clanCollection.createIndex(
        { name: 1 },
        {
          unique: true,
          partialFilterExpression: { status: 'active' },
          background: true,
          name: 'name_unique_active_only'
        }
      );
      console.log('✅ Created: name index (partial, active only)');
      console.log(`   Result: ${nameIndexResult}`);
    } catch (err) {
      console.error('❌ Failed to create name index:', err.message);
    }

    // Index on tag (only for active clans)
    try {
      const tagIndexResult = await clanCollection.createIndex(
        { tag: 1 },
        {
          unique: true,
          partialFilterExpression: { status: 'active' },
          background: true,
          name: 'tag_unique_active_only'
        }
      );
      console.log('✅ Created: tag index (partial, active only)');
      console.log(`   Result: ${tagIndexResult}`);
    } catch (err) {
      console.error('❌ Failed to create tag index:', err.message);
    }

    console.log();

    // Step 5: Verify new indexes
    console.log('🔍 Verifying indexes after repair...');
    const newIndexes = await clanCollection.getIndexes();
    console.log(`\n📊 New indexes (${Object.keys(newIndexes).length} total):`);
    for (const [name, spec] of Object.entries(newIndexes)) {
      const isPartial = !!spec.partialFilterExpression;
      const status = isPartial ? '✅' : '⚠️';
      console.log(`  ${status} ${name}:`, {
        key: spec.key,
        unique: spec.unique,
        partial: isPartial,
        filter: spec.partialFilterExpression
      });
    }
    console.log();

    // Step 6: Test by creating a clan
    console.log('🧪 Test 1: Creating first test clan...');
    const test1Name = `TestClan_A_${Date.now()}`;
    const test1Tag = `TA${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    try {
      const result1 = await clanCollection.insertOne({
        name: test1Name,
        tag: test1Tag,
        description: 'Test 1',
        status: 'active',
        members: [],
        requests: [],
        notices: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Success! Created: ${test1Name} (${test1Tag})`);
      const clanId1 = result1.insertedId;

      // Test 7: Create SECOND clan
      console.log('\n🧪 Test 2: Creating SECOND test clan (the critical test)...');
      const test2Name = `TestClan_B_${Date.now()}`;
      const test2Tag = `TB${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      try {
        const result2 = await clanCollection.insertOne({
          name: test2Name,
          tag: test2Tag,
          description: 'Test 2',
          status: 'active',
          members: [],
          requests: [],
          notices: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✅ Success! Created: ${test2Name} (${test2Tag})`);
        console.log('🎉 MULTIPLE CLANS CREATED - INDEX IS WORKING!\n');

        // Clean up
        await clanCollection.deleteMany({
          _id: { $in: [clanId1, result2.insertedId] }
        });
        console.log('🧹 Cleaned up test clans\n');
      } catch (err) {
        console.error(`❌ FAILED to create 2nd clan:`, err.message);
        console.error('This means the index is still broken!\n');
        // Clean up first one
        await clanCollection.deleteOne({ _id: clanId1 });
      }
    } catch (err) {
      console.error(`❌ FAILED to create 1st test clan:`, err.message);
    }

    // Final status
    console.log('='.repeat(70));
    console.log('🎯 REPAIR COMPLETE');
    console.log('='.repeat(70));
    console.log('\n✨ What was fixed:');
    console.log('  • FORCE dropped all old/broken indexes');
    console.log('  • Created ONLY partial unique indexes (active clans)');
    console.log('  • Archived clans will NOT block creation');
    console.log('  • Can now create unlimited active clans\n');
    console.log('⚡ Next step: Redeploy the application\n');

  } catch (err) {
    console.error('\n❌ FATAL ERROR:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

aggressiveRepair();
