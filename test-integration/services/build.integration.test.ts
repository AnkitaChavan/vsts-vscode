/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { Mocks } from "../helpers-integration/mocks";
import { TestSettings } from "../helpers-integration/testsettings";

import { Build, BuildBadge } from "vso-node-api/interfaces/BuildInterfaces";

import { CredentialManager } from "../../src/helpers/credentialmanager";
import { TeamServerContext } from "../../src/contexts/servercontext";
import { BuildService }  from "../../src/services/build";
import { WellKnownRepositoryTypes } from "../../src/helpers/constants";

var chai = require("chai");
/* tslint:disable:no-unused-variable */
var expect = chai.expect;
/* tslint:enable:no-unused-variable */
var assert = chai.assert;
chai.should();

describe("BuildService-Integration", function() {
    this.timeout(TestSettings.SuiteTimeout());

    var credentialManager: CredentialManager = new CredentialManager();
    var ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl());

    before(function() {
        return credentialManager.StoreCredentials(TestSettings.Account(), TestSettings.AccountUser(), TestSettings.Password());
    });
    beforeEach(function() {
        return credentialManager.GetCredentialHandler(ctx, undefined);
    });
    // afterEach(function() { });
    after(function() {
        return credentialManager.RemoveCredentials(TestSettings.Account());
    });

    it("should verify BuildService.GetBuildDefinitions", async function(done) {
        this.timeout(TestSettings.TestTimeout()); //http://mochajs.org/#timeouts

        var ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl());
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        try {
            let svc: BuildService = new BuildService(ctx);
            let definitions = await svc.GetBuildDefinitions(TestSettings.TeamProject());
            assert.isNotNull(definitions, "definitions was null when it shouldn't have been");
            //console.log(definitions.length);
            expect(definitions.length).to.equal(1);
            done();
        } catch (err) {
            done (err);
        }
    });

    it("should verify BuildService.GetBuildById", async function(done) {
        this.timeout(TestSettings.TestTimeout()); //http://mochajs.org/#timeouts

        var ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl());
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        try {
            let svc: BuildService = new BuildService(ctx);
            let build: Build = await svc.GetBuildById(TestSettings.BuildId());
            assert.isNotNull(build, "build was null when it shouldn't have been");
            //console.log(definitions.length);
            expect(build.buildNumber).to.equal(TestSettings.BuildId().toString());
            done();
        } catch (err) {
            done(err);
        }
    });

    it("should verify BuildService.GetBuildsByDefinitionId", async function(done) {
        this.timeout(TestSettings.TestTimeout()); //http://mochajs.org/#timeouts

        var ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl());
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        try {
            let svc: BuildService = new BuildService(ctx);
            let builds: Build[] = await svc.GetBuildsByDefinitionId(TestSettings.TeamProject(), TestSettings.BuildDefinitionId());
            assert.isNotNull(builds, "builds was null when it shouldn't have been");
            //console.log(definitions.length);
            expect(builds.length).to.equal(1);
            done();
        } catch (err) {
            done(err);
        }
    });

    it("should verify BuildService.GetBuildBadge", async function(done) {
        this.timeout(TestSettings.TestTimeout()); //http://mochajs.org/#timeouts

        var ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl());
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        try {
            let svc: BuildService = new BuildService(ctx);
            let badge: BuildBadge = await svc.GetBuildBadge(TestSettings.TeamProject(), WellKnownRepositoryTypes.TfsGit, TestSettings.RepositoryId(), "refs/heads/master");
            assert.isNotNull(badge, "badge was null when it shouldn't have been");
            done();
        } catch (err) {
            done(err);
        }
    });

});
